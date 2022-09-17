import React, {useEffect, useRef} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {Box, OrbitControls, Plane} from "@react-three/drei";
import {DoubleSide} from "three/src/constants";
import {suspend} from "suspend-react";
import {createAudio} from "../../../js/audioAnalyzer/audioAnalyzer";
import {lerp, mapLinear} from "three/src/math/MathUtils";
import {Color} from "three";

const BoxVisualizer = ({drums, other, bass, vocals}) => {
  const ref = useRef();
  const { gain: drumsGain, context: drumsContext, update: drumsUpdate } = suspend(() => createAudio(drums), [drums]);
  const { gain: otherGain, context: otherContext, update: otherUpdate } = suspend(() => createAudio(other), [other]);
  const { gain: bassGain, context: bassContext, update: bassUpdate } = suspend(() => createAudio(bass), [bass]);
  const { gain: vocalsGain, context: vocalsContext, update: vocalsUpdate } = suspend(() => createAudio(vocals), [vocals]);

  useEffect(() => {
    // Connect the gain node, which plays the audio
    drumsGain.connect(drumsContext.destination);
    otherGain.connect(otherContext.destination);
    bassGain.connect(bassContext.destination);
    vocalsGain.connect(vocalsContext.destination);

    // Disconnect it on dismount
    return () => {
      drumsGain.disconnect();
      otherGain.disconnect();
      bassGain.disconnect();
      vocalsGain.disconnect();
    }
  }, [drumsGain, drumsContext, otherGain, otherContext, bassGain, bassContext, vocalsGain, vocalsContext]);

  useFrame(() => {
    const {volumeAmplitude: drumsVolumeAmplitude} = drumsUpdate();
    const {volumeAmplitude: otherVolumeAmplitude} = otherUpdate();
    const {volumeAmplitude: bassVolumeAmplitude} = bassUpdate();
    const {volumeAmplitude: vocalsVolumeAmplitude} = vocalsUpdate();

    // Drums: scale
    ref.current.scale.x = lerp(ref.current.scale.x, 0.4 + drumsVolumeAmplitude, 0.1);
    ref.current.scale.y = lerp(ref.current.scale.y, 0.4 + drumsVolumeAmplitude, 0.1);
    ref.current.scale.z = lerp(ref.current.scale.z, 0.4 + drumsVolumeAmplitude, 0.1);

    // Bass: Vertical position
    ref.current.position.y = lerp(ref.current.position.y, 0.4 + bassVolumeAmplitude*5 + (ref.current.scale.y/2), 0.03);

    // Vocals: Rotation speed
    ref.current.rotation.y += mapLinear(vocalsVolumeAmplitude, 0, 0.5, 0, 0.3);
    ref.current.rotation.x += mapLinear(vocalsVolumeAmplitude, 0, 0.5, 0, 0.3);

    // Other: Color
    let currentColor = {};
    ref.current.material.color.getHSL(currentColor);
    const newColor = lerp(currentColor.h, mapLinear(otherVolumeAmplitude, 0, 0.05, 0, 360), 0.1);
    ref.current.material.color = new Color(`hsl(${newColor}, 100%, 50%)`);
  });

  return (
    <>
      <Box ref={ref} position={[0, 0.501, 0]} castShadow>
        <meshStandardMaterial/>
      </Box>
    </>
  )
};

const AudioBoxVisualizer = () => {
  return (
    <Canvas id="canvas" aspect={2.35} shadows camera={{position: [1.3, 2, 2.6]}}>
      <color attach="background" args={["black"]}/>
      <Plane position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]} args={[100, 100]} receiveShadow>
        <meshStandardMaterial color="#05badd" side={DoubleSide}/>
      </Plane>
      <BoxVisualizer
        drums={process.env.PUBLIC_URL + "/local/daylight/drums.wav"}
        other={process.env.PUBLIC_URL + "/local/daylight/other.wav"}
        bass={process.env.PUBLIC_URL + "/local/daylight/bass.wav"}
        vocals={process.env.PUBLIC_URL + "/local/daylight/vocals.wav"}
      />
      <ambientLight intensity={0.5}/>
      <pointLight position={[10, 10, 10]} castShadow/>
      <OrbitControls autoRotate autoRotateSpeed={3}/>
    </Canvas>
  )
};

export default AudioBoxVisualizer;