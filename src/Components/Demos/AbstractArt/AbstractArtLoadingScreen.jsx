import {Canvas, useFrame} from '@react-three/fiber';
import React, {useRef} from "react";
import {
  BufferAttribute,
  CatmullRomCurve3,
  Color,
  ExtrudeGeometry, MeshStandardMaterial,
  Shape,
  Vector2,
  Vector3
} from "three";
import {seededRandom} from "three/src/math/MathUtils";
import { EffectComposer, ChromaticAberration, Bloom, } from '@react-three/postprocessing'
import {BlendFunction} from 'postprocessing'
import {LinearSRGBColorSpace} from "three/src/constants";

const numPoints = 20;
const steps = 1000;
const spread = 0.17;
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
  const hw = 0.015;
  const hh = 0.015;

  const profile = new Shape([
    new Vector2(-hw, -hh),
    new Vector2(-hw*2,  hh*2),
    new Vector2( hw*2,  hh),
    new Vector2( hw, -hh*2),
    new Vector2(-hw, -hh)
  ]);

  const ribbonGeometry = new ExtrudeGeometry(profile, {
    steps: steps,
    extrudePath: curve
  });

  const numVerticesAfterSmoothing = ribbonGeometry.attributes.position.array.length / 3;
  let colors = new Float32Array(numVerticesAfterSmoothing*3);
  const color = new Color();

  let index = 0;
  for (let i = 0; i < numVerticesAfterSmoothing; i++) {
    const hue = i/numVerticesAfterSmoothing;
    color.setHSL(hue, 1, 0.5, LinearSRGBColorSpace);
    colors[index++] = color.r;
    colors[index++] = color.g;
    colors[index++] = color.b;
  }
  ribbonGeometry.setAttribute('color', new BufferAttribute(colors, 3));

  const ribbonMaterial = new MeshStandardMaterial({vertexColors: true});

  let offsets = Array.from(Array(numLines).keys()).map(x => (Math.round((x * spread - ((numLines - 1) * spread / 2)) * 100) / 100));

  return (
    <group ref={ref}>
      {offsets.map(i => {
        return <mesh castShadow receiveShadow key={i} args={[ribbonGeometry, ribbonMaterial]} position={[i, 0, 0]}/>
      })}
    </group>
  );
}

function Effects() {
  return (
    <EffectComposer>
      {bloom && <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} opacity={0.1}/>}
      <ChromaticAberration
        blendFunction={BlendFunction.ADD} // blend mode
        offset={[0.002, 0.002]} // color offset
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