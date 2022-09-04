import * as THREE from 'three'
import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { suspend } from 'suspend-react'
import React from "react";
import {createAudio} from "../audioAnalyzer";
import {mapLinear} from "three/src/math/MathUtils";

export default function AudioTrackAnalyzerDemo() {
  return (
    <Canvas id="canvas" shadows dpr={[1, 2]} camera={{ position: [-1, 1.5, 2], fov: 25 }}>
      <spotLight position={[-4, 4, -4]} angle={0.06} penumbra={1} castShadow shadow-mapSize={[2048, 2048]} />
      <Suspense fallback={null}>
        <Track position-z={-0.50} url={process.env.PUBLIC_URL + "/local/30_HOURS/bass.mp3"} />
        <Track position-z={-0.25} url={process.env.PUBLIC_URL + "/local/30_HOURS/drums.mp3"} />
        <Track position-z={0.00} url={process.env.PUBLIC_URL + "/local/30_HOURS/sample.mp3"} />
        <Track position-z={0.25} url={process.env.PUBLIC_URL + "/local/30_HOURS/vocal.mp3"} />
        <Zoom url={process.env.PUBLIC_URL + "/local/30_HOURS/drums.mp3"} />
      </Suspense>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]}>
        <planeGeometry />
        <shadowMaterial transparent opacity={0.15} />
      </mesh>
    </Canvas>
  )
}

function Track({ url, y = 2500, space = 1.8, width = 0.01, height = 0.05, obj = new THREE.Object3D(), ...props }) {
  const ref = useRef();
  // suspend-react is the library that r3f uses internally for useLoader. It caches promises and
  // integrates them with React suspense. You can use it as-is with or without r3f.
  const { gain, context, update, data } = suspend(() => createAudio(url), [url]);
  useEffect(() => {
    // Connect the gain node, which plays the audio
    gain.connect(context.destination);
    // Disconnect it on dismount
    return () => gain.disconnect()
  }, [gain, context]);

  useFrame(() => {
    let avg = update();
    // Distribute the instanced planes according to the frequency data
    for (let i = 0; i < data.length; i++) {
      obj.position.set(i * width * space - (data.length * width * space) / 2, data[i] / y, 0);
      obj.updateMatrix();
      ref.current.setMatrixAt(i, obj.matrix)
    }
    // Set the hue according to the frequency average
    ref.current.material.color.setHSL(avg / 500, 0.75, 0.75);
    ref.current.instanceMatrix.needsUpdate = true
  });

  return (
    <>
      <instancedMesh castShadow ref={ref} args={[null, null, data.length]} {...props}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </>
  )
}

/**
 * @return {null}
 */
function Zoom({ url, minFov=20, defaultFov=25 }) {
  // This will *not* re-create a new audio source, suspense is always cached,
  // so this will just access (or create and then cache) the source according to the url
  const { gain, context, update, data } = suspend(() => createAudio(url), [url]);

  useEffect(() => {
    // Connect the gain node, which plays the audio
    gain.connect(context.destination);
    // Disconnect it on dismount
    return () => gain.disconnect()
  }, [gain, context]);

  return useFrame((state) => {
    update();
    // Set the cameras field of view according to the frequency average
    state.camera.fov = mapLinear(data.avg, 0, 255, defaultFov, minFov);
    state.camera.updateProjectionMatrix();
  });
}
