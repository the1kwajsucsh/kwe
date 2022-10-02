import React, {useEffect, useRef} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import ManualOrbitControlledPerspectiveCamera from "../../Common/ManualOrbitControlledPerspectiveCamera";
import {suspend} from "suspend-react";
import {createAudio} from "../../../js/audioAnalyzer/audioAnalyzer";
import {Plane} from "@react-three/drei";
import {DoubleSide} from "three/src/constants";

const Visualizer = ({audio}) => {
  const WIDTH_SEGMENTS = 15;
  const HEIGHT_SEGMENTS = 15;

  const { gain, context, update } = suspend(() => createAudio(audio), [audio]);
  const planeRef = useRef();

  useEffect(() => {
    // Connect the gain node, which plays the audio
    gain.connect(context.destination);
    // Disconnect it on dismount
    return () => {
      gain.disconnect();
    }
  }, [gain, context]);

  useFrame(() => {
    const {oneTwentyFourthOctaveBands} = update();
    let freqSpacing = (oneTwentyFourthOctaveBands.length - 1) / ((WIDTH_SEGMENTS+1) * (HEIGHT_SEGMENTS+1));

    let curIndex = 0;
    let index = 0;
    for (let i = 0; i <= WIDTH_SEGMENTS; i++) {
      for (let j = 0; j <= HEIGHT_SEGMENTS; j++) {
        const newYValue = oneTwentyFourthOctaveBands[Math.round(curIndex)] / 255;

        planeRef.current.geometry.attributes.position.array[index + 2] = newYValue;
        curIndex += freqSpacing;
        index += 3;
      }
    }

    planeRef.current.geometry.computeVertexNormals();
    planeRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Plane ref={planeRef} args={[5, 5, WIDTH_SEGMENTS, HEIGHT_SEGMENTS]} rotation={[-Math.PI/2, 0, 0]}>
      <meshLambertMaterial color="red" side={DoubleSide} wireframe/>
    </Plane>
  )
};

const VisualizerPlane = () => {

  return (
    <>
      <Canvas id="canvas" aspect={2.35}>
        <color attach="background" args={["black"]}/>
        <ambientLight/>
        <pointLight position={[10, 6, -10]}/>
        <ManualOrbitControlledPerspectiveCamera/>
        <Visualizer audio={process.env.PUBLIC_URL + "/local/DY/05_UMAMI.mp3"}/>
      </Canvas>
    </>
  )
};

export default VisualizerPlane;