import React, {useMemo, useRef} from "react";
import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {OrbitControls, Stats} from "@react-three/drei";
import {BufferAttribute, DoubleSide, ImageUtils, PlaneBufferGeometry, sRGBEncoding} from "three";
import {TextureLoader} from "three/src/loaders/TextureLoader";
import {SymbolShader} from "./SymbolShader";
import {randInt} from "three/src/math/MathUtils";

const Symbol = ({symbolFadeInterval=0.02, symbolFadePercentage=0.01, height=1, width=1, position=[0,0,0], initialOpacity=1, minNegativeOpacity=-1}) => {
  const textureAtlas = useLoader(TextureLoader, process.env.PUBLIC_URL + "/Demos/MatrixRain/atlas.png");
  const textureXOffset = randInt(0, 4) * 0.2;
  const textureYOffset = randInt(0, 4) * 0.2;

  // const ref = useRef();
  //
  // let prevTime = 0;
  // let curTime;
  //
  // useFrame(({clock}) => {
  //   curTime = clock.getElapsedTime();
  //
  //   if (curTime - prevTime > symbolFadeInterval) {
  //     prevTime = curTime;
  //     ref.current.opacity -= symbolFadePercentage;
  //     if (ref.current.opacity < minNegativeOpacity) {
  //       ref.current.opacity = 1;
  //     }
  //
  //     // Random chance to change texture
  //     if (Math.random() < 0.001) {
  //       // ref.current.map = textures[randInt(0, textures.length-1)];
  //     }
  //   }
  // });


  const geometry = new PlaneBufferGeometry();
  const count = geometry.attributes.position.count;
  const float32Array = new Float32Array(count*2);
  for (let i = 0; i < count*2; i +=2) {
    float32Array[i] = textureXOffset;
    float32Array[i+1] = textureYOffset;
  }
  geometry.setAttribute('textureOffsets', new BufferAttribute(float32Array, 2));


  return (
    <mesh position={position} rotation={[0, 0, 0]} scale={[1, height, width]} geometry={geometry}>
      <shaderMaterial
        attach="material"
        args={[SymbolShader]}
        uniforms-textureAtlas-value={textureAtlas}
        uniforms-initialOpacity-value={1.0}
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
    <group position={[numColumns/2, numColumns/2, 0]}>
      {
        columns.map((val, index) => {
          if (!val) {
            return <SymbolLine key={index} numSymbols={numColumns} position={[index + (index*0.1), 0, 0]} initialOffset={Math.random()} />
          }
        })
      }
    </group>
  );
}

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