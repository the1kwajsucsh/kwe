import React, {useLayoutEffect, useRef} from "react";
import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {OrbitControls, Stats} from "@react-three/drei";
import {BufferAttribute, DoubleSide} from "three";
import {TextureLoader} from "three/src/loaders/TextureLoader";
import {SymbolShader} from "./SymbolShader";
import {randFloat, randInt} from "three/src/math/MathUtils";
import {Bloom, EffectComposer} from "@react-three/postprocessing";

let heightVelocities;

const getNewTextureOffset = () => {
  return randInt(0, 4) * 0.2;
};

const initializeTextureOffsets = (numVertices) => {
  const float32Array = new Float32Array(numVertices*2);
  for (let i = 0; i < numVertices*2; i++) {
    float32Array[i] = getNewTextureOffset();
  }
  return float32Array;
};

const updateTexture = (textureOffsetArray) => {
  const PERCENT_TO_UPDATE = 0.005;
  for (let i = 0; i < textureOffsetArray.length/2 * PERCENT_TO_UPDATE; i++) {
    const randomIndex = randInt(0, textureOffsetArray.length/2) * 2;
    textureOffsetArray[randomIndex] = getNewTextureOffset();
    textureOffsetArray[randomIndex+1] = getNewTextureOffset();
  }
};

const getNewOpacityVelocity = () => {
  return randFloat(0.3, 1.3);
};

const initializeOpacities = (width, height) => {
  heightVelocities = Array.from({length: width}, () => getNewOpacityVelocity());
  const float32Array = new Float32Array(width*height).fill(1.0);

  let id = 0;
  for (let i = 0; i < width; i++) {
    const initialOffset = randFloat(0, 1);

    for (let j = 0; j < height; j++) {
      float32Array[id++] = -j/height + initialOffset;
    }
  }

  return float32Array;
};

const updateOpacity = (attributesArray, symbolFadeInterval, minNegativeOpacity, width, height) => {
  let index = 0;
  for (let i = 0; i < width; i++) {

    let freeze = false;
    if (attributesArray[index] < 0) {
      //freeze = true;
      heightVelocities[i] = getNewOpacityVelocity();
    }

    for (let j = 0; j < height; j++) {
      let opacity = attributesArray[index] - symbolFadeInterval*heightVelocities[i];
      if (opacity < minNegativeOpacity) {
        opacity = 1.0;
      }

      if (!freeze) {
        attributesArray[index] = opacity;
      }
      index++;
    }
  }
};

const MatrixRainPlane = ({
                           width = 50,
                           height=25,
                           symbolFadeInterval=0.01,
                           symbolFadePercentage=0.01,
                           minNegativeOpacity=-2,
                           position=[0, 0, 0],
                           rotation=[0, 0, 0]
}) => {
  const ref = useRef();
  const positionRef = useRef();
  const opacityRef = useRef();
  const textureOffsetRef = useRef();
  const textureAtlas = useLoader(TextureLoader, process.env.PUBLIC_URL + "/Demos/MatrixRain/atlas_matrix.png");

  let prevTime = 0;
  let curTime;
  useFrame(({clock}) => {
    curTime = clock.getElapsedTime();

    // update opacity & texture
    if (curTime - prevTime > symbolFadeInterval) {
      prevTime = curTime;

      updateOpacity(opacityRef.current.array, symbolFadeInterval, minNegativeOpacity, width, height);
      opacityRef.current.needsUpdate = true;

      updateTexture(textureOffsetRef.current.array);
      textureOffsetRef.current.needsUpdate = true;
    }
  });

  useLayoutEffect(() => {
    // set positions
    let id = 0;
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        positionRef.current.array[id++] = i*0.6;
        positionRef.current.array[id++] = j*0.6;
        positionRef.current.array[id++] = 0;
      }
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <group position={[-width*0.6/2, -height*0.6/2, 0]}>
        <points ref={ref}>
          <bufferGeometry>
            <bufferAttribute
              ref={positionRef}
              attach="attributes-position"
              {...new BufferAttribute(new Float32Array(width*height*3), 3)}
            />
            <bufferAttribute
              ref={textureOffsetRef}
              attach="attributes-textureOffsets"
              {...new BufferAttribute(initializeTextureOffsets(width*height), 2)}
            />
            <bufferAttribute
              ref={opacityRef}
              attach="attributes-opacity"
              {...new BufferAttribute(initializeOpacities(width, height), 1)}
            />
          </bufferGeometry>
          <shaderMaterial
            attach="material"
            args={[SymbolShader]}
            uniforms-textureAtlas-value={textureAtlas}
            uniforms-u_time-value={0.0}
            side={DoubleSide}
            transparent
            depthWrite={false}
          />
        </points>
      </group>
    </group>
  );
};

const MatrixRain = () => {
  return (
    <>
      <Canvas id="canvas" aspect={2.35} camera={{position: [0, 0, 30]}}>
        <color attach="background" args={["black"]}/>
        <ambientLight/>
        <pointLight position={[10, 10, 10]}/>
        <OrbitControls/>
        <MatrixRainPlane/>
        <MatrixRainPlane position={[14,0,15]} rotation={[0, Math.PI/2, 0]}/>
        <Stats/>
        <EffectComposer>
          <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>
      </Canvas>
    </>
  )
};

export default MatrixRain;