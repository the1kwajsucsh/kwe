import React, {useRef} from "react";
import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {OrbitControls, Stats} from "@react-three/drei";
import {BufferAttribute, DoubleSide, PlaneBufferGeometry} from "three";
import {TextureLoader} from "three/src/loaders/TextureLoader";
import {SymbolShader} from "./SymbolShader";
import {randInt} from "three/src/math/MathUtils";

const NUM_VERT_IN_GEOM = 4;

const getNewTextureOffset = () => {
  return randInt(0, 4) * 0.2;
};

const initializeTextureOffsets = (textureXOffset, textureYOffset) => {
  const float32Array = new Float32Array(NUM_VERT_IN_GEOM*2);
  for (let i = 0; i < NUM_VERT_IN_GEOM*2; i +=2) {
    float32Array[i] = textureXOffset;
    float32Array[i+1] = textureYOffset;
  }
  return float32Array;
};

const updateTextureOffsets = (attributesArray) => {
  const newXOffset = getNewTextureOffset();
  const newYOffset = getNewTextureOffset();

  for (let i = 0; i < attributesArray.size; i += 2) {
    attributesArray[i] = newXOffset;
    attributesArray[i+1] = newYOffset;
  }
};

const initializeOpacity = (initialOpacity) => {
  return new Float32Array(NUM_VERT_IN_GEOM).fill(initialOpacity)
};

const updateOpacity = (attributesArray, symbolFadeInterval, minNegativeOpacity) => {
  let opacity = attributesArray[0] - symbolFadeInterval;
  if (opacity < minNegativeOpacity) {
    opacity = 1.0;
  }
  attributesArray.fill(opacity)
};

const Symbol = ({symbolFadeInterval=0.02, symbolFadePercentage=0.01, height=1, width=1, position=[0,0,0], initialOpacity=1, minNegativeOpacity=-1}) => {
  const materialRef = useRef();
  const geometryRef = useRef();
  const textureAtlas = useLoader(TextureLoader, process.env.PUBLIC_URL + "/Demos/MatrixRain/atlas.png");
  const textureXOffset = getNewTextureOffset();
  const textureYOffset = getNewTextureOffset();

  let prevTime = 0;
  let curTime;
  useFrame(({clock}) => {
    curTime = clock.getElapsedTime();
    if (curTime - prevTime > symbolFadeInterval) {
      prevTime = curTime;

      // update opacity for falling effect
      updateOpacity(geometryRef.current.attributes.opacity.array, symbolFadeInterval, minNegativeOpacity);
      geometryRef.current.attributes.opacity.needsUpdate = true;


      // Random chance to change texture
      if (Math.random() < 0.001) {
        updateTextureOffsets(geometryRef.current.attributes.textureOffsets.array);
        geometryRef.current.attributes.textureOffsets.needsUpdate = true;
      }
    }

    materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
  });

  return (
    <mesh position={position} rotation={[0, 0, 0]} scale={[1, height, width]}>
      <planeBufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-textureOffsets"
          {...new BufferAttribute(initializeTextureOffsets(textureXOffset, textureYOffset), 2)}
        />
        <bufferAttribute
          attach="attributes-opacity"
          {...new BufferAttribute(initializeOpacity(initialOpacity), 1)}
        />
      </planeBufferGeometry>
      <shaderMaterial
        ref={materialRef}
        attach="material"
        args={[SymbolShader]}
        uniforms-textureAtlas-value={textureAtlas}
        uniforms-u_time-value={0.0}
        side={DoubleSide}
        transparent
      />
    </mesh>
  );
};

const SymbolLine = ({numSymbols=50, position=[0,0,0], initialOffset = 0}) => {
  const symbols = Array(numSymbols).fill(false);

  return (
    <group position={position}>
      {
        symbols.map((val, index) => {
          if (!val) {
            return <Symbol key={index} position={[0, index + (index*0.1), 0]} initialOpacity={-index/numSymbols + initialOffset} />
          }
        })
      }
    </group>
  );
};

const SymbolPlane = ({numColumns=25}) => {
  const columns = Array(numColumns).fill(false);

  return (
    <group position={[-numColumns/2, -numColumns/2, 0]}>
      {
        columns.map((val, index) => {
          if (!val) {
            return <SymbolLine key={index} numSymbols={numColumns} position={[index + (index*0.1), 0, 0]} initialOffset={Math.random()} />
          }
        })
      }
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
        <SymbolPlane/>
        <Stats/>
      </Canvas>
    </>
  )
};

export default MatrixRain;