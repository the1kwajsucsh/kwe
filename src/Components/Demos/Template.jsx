import React from "react";
import {Canvas} from "@react-three/fiber";
import ManualOrbitControlledPerspectiveCamera from "../Common/ManualOrbitControlledPerspectiveCamera";
import Box from "./Box";

const Template = () => {
  return (
    <>
      <Canvas id="canvas" aspect={2.35}>
        <color attach="background" args={["black"]}/>
        <ambientLight/>
        <pointLight position={[10, 10, 10]}/>
        <ManualOrbitControlledPerspectiveCamera/>
        <Box position={[-1.2, 0, 0]}/>
        <Box position={[1.2, 0, 0]}/>
      </Canvas>
    </>
  )
};

export default Template;