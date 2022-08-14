import React, {useLayoutEffect, useRef} from "react";
import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {OrbitControls, Stats} from "@react-three/drei";
import {BufferAttribute, DoubleSide} from "three";
import {TextureLoader} from "three/src/loaders/TextureLoader";
import {SymbolShader} from "./SymbolShader";
import {randInt} from "three/src/math/MathUtils";

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

const initializeOpacities = (width, height) => {
  const float32Array = new Float32Array(width*height).fill(1.0);

  let id = 0;
  for (let i = 0; i < width; i++) {
    const initialOffset = Math.random();

    for (let j = 0; j < height; j++) {
      float32Array[id++] = -j/height + initialOffset;
    }
  }

  return float32Array;
};

const updateOpacity = (attributesArray, symbolFadeInterval, minNegativeOpacity) => {
  for (let i = 0; i < attributesArray.length; i++) {
    let opacity = attributesArray[i] - symbolFadeInterval;
    if (opacity < minNegativeOpacity) {
      opacity = 1.0;
    }
    attributesArray[i] = opacity;
  }
};

const MatrixRainPlane = ({width = 25, height=25, symbolFadeInterval=0.02, symbolFadePercentage=0.01, minNegativeOpacity=-1}) => {
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

      updateOpacity(opacityRef.current.array, symbolFadeInterval, minNegativeOpacity);
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
        positionRef.current.array[id++] = i;
        positionRef.current.array[id++] = j;
        positionRef.current.array[id++] = 0;
      }
    }

    console.log(ref.current);
    console.log(opacityRef.current);
  });

  return (
    <group position={[-width/2, -height/2, 0]}>
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
  );
};

const MatrixRain = () => {
  return (
    <>
      <Canvas id="canvas" aspect={2.35} camera={{position: [0, 0, 30]}}>
        <color attach="background" args={["gray"]}/>
        <ambientLight/>
        <pointLight position={[10, 10, 10]}/>
        <OrbitControls/>
        <MatrixRainPlane/>
        <Stats/>
      </Canvas>
    </>
  )
};

export default MatrixRain;