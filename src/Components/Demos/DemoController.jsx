import React, {useEffect, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {PerspectiveCamera, Text} from "@react-three/drei";
import Template from "./Template";
import AbstractArt from "./AbstractArt/AbstractArt";
import AbstractArt2 from "./AbstractArt2/AbstractArt2";
import Terminal from "./Terminal/Terminal";
import SphereVideo from "./SphereVideo/SphereVideo";
import CircleSpinners from "./CircleSpinners/CircleSpinners";
import WarpedDiscoWall from "./WarpedDiscoWall/WarpedDiscoWall";
import Nut from "./Nut/Nut";
import SplineSquares from "./SpineSquares/SplineSquares";
import WebcamVisualizer from "./WebcamVisualizer/WebcamVisualizer";
import MatrixRain from "./MatrixRain/MatrixRain";
import SimpleVisualizers from "./SimpleVisualizers/SimpleVisualizers";
import AudioBoxVisualizer from "./AudioBoxVisualizer/AudioBoxVisualizer";

const Controller = ({demo}) => {
  const [curDemo, setCurDemo] = useState("");

  useFrame(() => {
    if (curDemo !== demo.current) {
      setCurDemo(demo.current);
    }
  });

  useEffect(() => {
    console.log("CONTROLLER RE_RENDERED")
  });

  switch (curDemo) {
    case "Template":
      return <Template/>;
    case "Abstract Art":
      return <AbstractArt/>;
    case "AbstractArt2_Basement":
      return <AbstractArt2/>;
    case "Terminal":
      return <Terminal/>;
    case "Sphere Video":
      return <SphereVideo/>;
    case "Circle Spinners":
      return <CircleSpinners/>;
    case "Warped Disco Wall":
      return <WarpedDiscoWall/>;
    case "Nut":
      return <Nut/>;
    case "Spline Squares":
      return <SplineSquares/>;
    case "Webcam Visualizer":
      return <WebcamVisualizer/>;
    case "Matrix Rain":
      return <MatrixRain/>;
    case "Simple Visualizers":
      return <SimpleVisualizers/>;
    case "Audio Box Visualizer":
      return <AudioBoxVisualizer/>;
    default:
      return (
        <>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <Text color="black" anchorX="center" anchorY="middle" fontSize={0.3}>404 | Demo not found</Text>
        </>
        );
  }
};

const DemoController = ({demo}) => {

  useEffect(() => {
    console.log("Demo Controller re-rendered w/ Demo " + demo.current);
  });

  return (
    <Canvas id="canvas" shadows>
      <Controller demo={demo}/>
    </Canvas>
  );
};

export default DemoController;