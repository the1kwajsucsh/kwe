import React, {useLayoutEffect, useRef, useState} from "react";
import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {OrbitControls, Stats} from "@react-three/drei";
import {BufferAttribute, DoubleSide} from "three";
import {TextureLoader} from "three/src/loaders/TextureLoader";
import {SymbolShader} from "./SymbolShader";
import {clamp, randInt} from "three/src/math/MathUtils";
import {Bloom, EffectComposer} from "@react-three/postprocessing";

function sfc32(a, b, c, d) {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

const generateNewOpacityFadeAmount = (opacityFadeAmount, randFunction) => {
  const MIN = 0.01;
  const MAX = 0.4;

  if (opacityFadeAmount === MIN) {
    opacityFadeAmount += randFunction()/3;
  } else if (opacityFadeAmount === MAX) {
    opacityFadeAmount -= randFunction()/3;
  } else {
    let preAdjustment = opacityFadeAmount + (randFunction()-0.5)/5;

    if (randFunction() < 0.5) {
      preAdjustment = clamp(preAdjustment, 0.02, 0.1);
    }

    opacityFadeAmount = clamp(preAdjustment, MIN, MAX);
  }

  return opacityFadeAmount;
};


const initializeOpacityColumnIndices = (width, lengthOfCycle) => {
  return Array.from({length: width}, () => randInt(0, lengthOfCycle - 1));
};

const initializeOpacityCycle = (length, opacityFadeAmount, rootChanceOfNewString) => {
  let rand = sfc32(Math.random() * 80, Math.random() * 30, Math.random() * 1000, Math.random() * 20);

  const array = Array.from({length: length}).fill(1);
  let newPatternAllowed = true;

  for (let i = 0; i < length; i++) {
    if ((length-i) < 1/opacityFadeAmount) {
      newPatternAllowed = false;
    }

    if (newPatternAllowed && rand() < rootChanceOfNewString) {
      array[i] = 1;

      opacityFadeAmount = generateNewOpacityFadeAmount(opacityFadeAmount, rand);
    } else {
      array[i] = Math.max(0, (array[i-1] || 0) - opacityFadeAmount);
    }
  }

  return array;
};


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
  return new Float32Array(width * height).fill(1.0);
};

const updateOpacity = (attributesArray, opacityCycle, opacityColumnIndices, width, height) => {
  let index = 0;

  for (let i = 0; i < width; i++) {

    opacityColumnIndices[i] = (opacityColumnIndices[i] + 1) % opacityCycle.length;

    let freeze = false;

    for (let j = 0; j < height; j++) {
      let opacity = opacityCycle[(opacityColumnIndices[i] + j) % opacityCycle.length];

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
                           symbolFadeInterval=0.05,
                           symbolFadePercentage=0.02,
                           minNegativeOpacity=-2,
                           position=[0, 0, 0],
                           rotation=[0, 0, 0]
}) => {
  const ref = useRef();
  const positionRef = useRef();
  const opacityRef = useRef();
  const textureOffsetRef = useRef();
  const materialRef = useRef();
  const textureAtlas = useLoader(TextureLoader, process.env.PUBLIC_URL + "/Demos/MatrixRain/atlas_matrix.png");
  const [opacityCycle] = useState(initializeOpacityCycle(width*height*2, symbolFadePercentage, 0.05));
  const [opacityColumnIndices] = useState(initializeOpacityColumnIndices(width, opacityCycle.length));

  let prevTime = 0;
  let curTime;
  useFrame(({clock}) => {
    curTime = clock.getElapsedTime();

    // update opacity & texture
    if (curTime - prevTime > symbolFadeInterval) {
      prevTime = curTime;

      updateOpacity(opacityRef.current.array, opacityCycle, opacityColumnIndices, width, height);
      opacityRef.current.needsUpdate = true;

      updateTexture(textureOffsetRef.current.array);
      textureOffsetRef.current.needsUpdate = true;

      materialRef.current.uniforms.u_time.value = clock.elapsedTime;
      materialRef.current.needsUpdate = true;
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
            ref={materialRef}
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