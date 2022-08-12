import React, {useRef} from "react";
import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {OrbitControls, Stats} from "@react-three/drei";
import {DoubleSide, TextureLoader} from "three";
import {randInt} from "three/src/math/MathUtils";

const Symbol = ({symbolFadeInterval=0.02, symbolFadePercentage=0.01, height=1, width=1, position=[0,0,0], initialOpacity=1, minNegativeOpacity=-1}) => {
  const textures = useLoader(TextureLoader, [
    process.env.PUBLIC_URL + "/Demos/MatrixRain/1.png",
    process.env.PUBLIC_URL + "/Demos/MatrixRain/2.png",
    process.env.PUBLIC_URL + "/Demos/MatrixRain/3.png"
  ]);

  const ref = useRef();

  let prevTime = 0;
  let curTime;

  useFrame(({clock}) => {
    curTime = clock.getElapsedTime();

    if (curTime - prevTime > symbolFadeInterval) {
      prevTime = curTime;
      ref.current.opacity -= symbolFadePercentage;
      if (ref.current.opacity < minNegativeOpacity) {
        ref.current.opacity = 1;
      }

      // Random chance to change texture
      if (Math.random() < 0.001) {
        ref.current.map = textures[randInt(0, textures.length-1)];
      }
    }
  });

  return (
    <mesh position={position} rotation={[0, 0, 0]} scale={[1, height, width]}>
      <planeBufferGeometry />
      <meshStandardMaterial ref={ref} map={textures[randInt(0, textures.length-1)]} side={DoubleSide} transparent opacity={initialOpacity}/>
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
            return <Symbol key={index} position={[0, index, 0]} initialOpacity={-index/numSymbols + initialOffset} />
          }
        })
      }
    </group>
  );
};

const SymbolPlane = ({numColumns=25}) => {
  const columns = Array(numColumns).fill(false);

  return (
    <group position={[-12.5, -12.5, 0]}>
      {
        columns.map((val, index) => {
          if (!val) {
            return <SymbolLine key={index} numSymbols={25} position={[index, 0, 0]} initialOffset={Math.random()} />
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