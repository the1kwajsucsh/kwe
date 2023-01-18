import React from "react";
import ManualOrbitControlledPerspectiveCamera from "../Common/ManualOrbitControlledPerspectiveCamera";
import InteractiveBox from "./Box";

const Template = () => {
  return (
    <>
      <color attach="background" args={["black"]}/>
      <ambientLight/>
      <pointLight position={[10, 10, 10]}/>
      <ManualOrbitControlledPerspectiveCamera/>
      <InteractiveBox position={[-1.2, 0, 0]}/>
      <InteractiveBox position={[1.2, 0, 0]}/>
    </>
  )
};

export default Template;