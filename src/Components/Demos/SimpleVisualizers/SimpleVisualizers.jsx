import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import ManualOrbitControlledPerspectiveCamera from "../../Common/ManualOrbitControlledPerspectiveCamera";
import {suspend} from "suspend-react";
import {createAudio} from "../../../js/audioAnalyzer/audioAnalyzer";
import {Object3D, Shape} from "three";
import {DoubleSide} from "three/src/constants";
import {Line, Plane} from "@react-three/drei";

let ONE_THIRD_BAND = Array.from({length: 30}, () => [0, 0, 0]);
const ONE_THIRD_BAND_LENGTH = ONE_THIRD_BAND.length;

let ONE_TWENTY_FOURTH_BAND = Array.from({length: 244}, () => [0, 0, 0]);
const ONE_TWENTY_FOURTH_BAND_LENGTH = ONE_TWENTY_FOURTH_BAND.length;

const PolygonVisualizer = ({dataType}) => {
  const LEN = dataType === "THIRD" ? ONE_THIRD_BAND_LENGTH : ONE_TWENTY_FOURTH_BAND_LENGTH;
  const ref = useRef();
  const [shape, setShape] = useState(new Shape());

  useFrame(() => {
    updateShape(dataType === "THIRD" ? ONE_THIRD_BAND : ONE_TWENTY_FOURTH_BAND);
  });

  const updateShape = (data) => {
    const tempShape = new Shape();
    tempShape.moveTo(0, 0);

    for (let i = 1; i <= LEN; i++) {
      tempShape.lineTo((i/LEN)*2, data[i-1]/256);
    }

    tempShape.lineTo(2 + 1/LEN, 0);
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

const PolylineVisualizer = ({dataType}) => {
  const LEN =  dataType === "THIRD" ? ONE_THIRD_BAND_LENGTH : ONE_TWENTY_FOURTH_BAND_LENGTH;

  const ref = useRef();
  const [initialPoints] = useState(Array.from({length: LEN + 2}, (_, i) => [i/LEN*2, 0, 0]));


  useFrame(() => {
    updateLine(dataType === "THIRD" ? ONE_THIRD_BAND : ONE_TWENTY_FOURTH_BAND);
  });

  const updateLine = (data) => {
    const updatedPositions = [];
    updatedPositions.push(0, 0, 0);
    for (let i = 1; i <= LEN; i++) {
      updatedPositions.push((i/LEN)*2, data[i-1]/256, 0);
    }
    updatedPositions.push(2 + 1/LEN, 0, 0);

    ref.current.geometry.setPositions(updatedPositions);
  };

  return (
    <Line
      ref={ref}
      points={initialPoints}
      color="blue"
      lineWidth={3}
    />
  )
};

const BoxVisualizer = ({dataType}) => {
  const LEN = dataType === "THIRD" ? ONE_THIRD_BAND_LENGTH : ONE_TWENTY_FOURTH_BAND_LENGTH;
  const SPACE = dataType === "THIRD" ? 0.01 : 0.0;
  const BOX_WIDTH = 2/LEN - SPACE;
  const obj = new Object3D();
  const ref = useRef();

  useFrame(() => {
    for (let i = 0; i < LEN; i++) {
      const HEIGHT = (dataType === "THIRD" ? ONE_THIRD_BAND : ONE_TWENTY_FOURTH_BAND)[i]/256;
      obj.scale.set(1, HEIGHT, 1);
      obj.position.set(BOX_WIDTH/2 + i * (BOX_WIDTH + SPACE), HEIGHT/2, 0);
      obj.updateMatrix();
      ref.current.setMatrixAt(i, obj.matrix);
    }

    ref.current.instanceMatrix.needsUpdate = true
  });

  return (
    <instancedMesh ref={ref} args={[null, null, LEN]}>
      <planeGeometry args={[BOX_WIDTH, 1]} />
      <meshBasicMaterial color="green" side={DoubleSide}/>
    </instancedMesh>
  )
};

const Visualizer = ({audio}) => {
  const { gain, context, update } = suspend(() => createAudio(audio), [audio]);

   useEffect(() => {
      gain.connect(context.destination);
      return () => {
        gain.disconnect();
      }
    }, [gain, context]);

  useFrame(() => {
    updateData();
  });

  useLayoutEffect(() => {
    updateData();
  });

  const updateData = () => {
    const {oneThirdOctaveBands, oneTwentyFourthOctaveBands} = update();
    ONE_TWENTY_FOURTH_BAND = oneTwentyFourthOctaveBands;
    ONE_THIRD_BAND = oneThirdOctaveBands;
  };

  return (
    <>
      <group position={[-2.05, 0, 0]}>
        <PolygonVisualizer dataType="THIRD"/>
      </group>
      <group position={[-2.05, 1, 0]}>
        <PolylineVisualizer dataType="THIRD"/>
      </group>
      <group position={[-2.05, 2, 0]}>
        <BoxVisualizer dataType="THIRD"/>
      </group>
      <group position={[0.05, 0, 0]}>
        <PolygonVisualizer dataType="TWENTY_FOURTH"/>
      </group>
      <group position={[0.05, 1, 0]}>
        <PolylineVisualizer dataType="TWENTY_FOURTH"/>
      </group>
      <group position={[0.05, 2, 0]}>
        <BoxVisualizer dataType="TWENTY_FOURTH"/>
      </group>
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
      <Plane args={[1000, 1000]} rotation={[Math.PI/2, 0, 0]}>
        <meshStandardMaterial color="white" side={DoubleSide}/>
      </Plane>
      <fog attach="fog" args={["gray", 0, 40]} />
    </Canvas>
  );
};

export default SimpleVisualizers;