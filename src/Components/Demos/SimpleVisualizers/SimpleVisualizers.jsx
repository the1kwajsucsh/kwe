import React, {useEffect, useRef, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import ManualOrbitControlledPerspectiveCamera from "../../Common/ManualOrbitControlledPerspectiveCamera";
import {suspend} from "suspend-react";
import {createAudio} from "../../../js/audioAnalyzer/audioAnalyzer";
import {Shape} from "three";
import {DoubleSide} from "three/src/constants";
import {Plane} from "@react-three/drei";

const PolygonVisualizer = ({oneThirdOctaveBands}) => {

  const ref = useRef();
  const [shape, setShape] = useState(new Shape());

  useFrame(() => {
    updateShape(oneThirdOctaveBands);
  });

  const updateShape = (data) => {
    const tempShape = new Shape();
    tempShape.moveTo(0, 0);
    for (let i = 1; i <= 30; i++) {
      tempShape.lineTo((i/30)*2, data[i-1]/256);
    }
    tempShape.lineTo(31, 0);
    tempShape.lineTo(0, 0);

    setShape(tempShape);
  };

  return (
    <mesh>
      <shapeGeometry args={[shape]} ref={ref}/>
      <meshBasicMaterial color="red" side={DoubleSide}/>
    </mesh>
  )
};

const Visualizer = ({audio}) => {
  const [oneThirdOctaveBands, setOneThirdOctaveBands] = useState([]);

  const { gain, context, update } = suspend(() => createAudio(audio), [audio]);

  useEffect(() => {
    gain.connect(context.destination);
    return () => {
      gain.disconnect();
    }
  }, [gain, context]);

  useFrame(() => {
    const {oneThirdOctaveBands} = update(); // 30 points
    setOneThirdOctaveBands(oneThirdOctaveBands);
  });

  return (
    <>
      <PolygonVisualizer oneThirdOctaveBands={oneThirdOctaveBands}/>
    </>
  )

};

const SimpleVisualizers = () => {
  return (
    <Canvas id="canvas" aspect={2.35} >
      <color attach="background" args={["gray"]}/>
      <ambientLight/>
      <directionalLight position={[10, 10, 10]} castShadow/>
      <ManualOrbitControlledPerspectiveCamera/>
      <Visualizer  audio={process.env.PUBLIC_URL + "/local/DY/05_UMAMI.mp3"}/>
      <Plane args={[100, 100]} rotation={[Math.PI/2, 0, 0]}>
        <meshStandardMaterial color="white" side={DoubleSide}/>
      </Plane>
      <fog attach="fog" args={["gray", 0, 40]} />
    </Canvas>
  );
};

export default SimpleVisualizers;