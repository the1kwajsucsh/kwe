import {Canvas, useFrame} from '@react-three/fiber';
import React, {useRef} from "react";
import {
  CatmullRomCurve3,
  ExtrudeGeometry, MeshStandardMaterial,
  Shape,
  Vector2,
  Vector3
} from "three";
import {seededRandom} from "three/src/math/MathUtils";
import { EffectComposer, ChromaticAberration, Bloom, } from '@react-three/postprocessing'
import {BlendFunction} from 'postprocessing'

const hh = 0.01;
const numPoints = 20;
const steps = 1000;
const spread = 0.1;
const numLines = 5;
const bloom = true;

function Ribbon({seed}) {
  const ref = useRef();
  useFrame(() => {
    ref.current.rotation.y += 0.005;
  });

  let points = [];
  seededRandom(seed);

  let randPoint = () => {
    return (seededRandom() - 0.5) * 7;
  };

  for (let i = 0; i < numPoints; i++) {
    points.push(new Vector3(randPoint(), randPoint(), randPoint()));
  }

  const curve = new CatmullRomCurve3([...points], true);
  const hw = 0.001;

  const profile = new Shape([
    new Vector2(-hw, -hh),
    new Vector2(-hw,  hh),
    new Vector2( hw,  hh),
    new Vector2( hw, -hh),
    new Vector2(-hw, -hh)
  ]);

  const ribbonGeometry = new ExtrudeGeometry(profile, {
    steps: steps,
    extrudePath: curve
  });

  const ribbonMaterial = new MeshStandardMaterial({color: "white"});

  let meshes = Array.from(Array(numLines).keys()).map(x => (Math.round((x * spread - ((numLines - 1) * spread / 2)) * 100) / 100));

  return (
    <group ref={ref}>
      {meshes.map(i => {
        return <mesh castShadow receiveShadow key={i} args={[ribbonGeometry, ribbonMaterial]} position={[i, 0, 0]}/>
      })}
    </group>
  );
}

function Effects() {
  return (
    <EffectComposer>
      {bloom && <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} opacity={0.3}/>}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL} // blend mode
        offset={[0.003, 0.002]} // color offset
      />
    </EffectComposer>
  )
}

function AbstractArtLoadingScreen({seed = 1}) {
  return (
    <Canvas id="canvas" shadows camera={{position:[-5,2,10], fov:60}}>
      <color attach="background" args={["black"]} />
      <ambientLight intensity={0.2}/>
      <directionalLight
        castShadow
        position={[-5,5,0]}
        intensity={2}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left = {-10}
        shadow-camera-right = {10}
        shadow-camera-top = {10}
        shadow-camera-bottom = {-10}
      />
      <group>
        <Ribbon seed={seed}/>
      </group>
      <Effects />
    </Canvas>
  );
}

export default AbstractArtLoadingScreen;