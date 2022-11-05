import {Canvas} from "@react-three/fiber";
import React from "react";
import {Edges, Plane, RoundedBox, Text, useProgress} from "@react-three/drei";
import {Bloom, EffectComposer, Glitch, Scanline} from "@react-three/postprocessing";
import { GlitchMode, BlendFunction } from 'postprocessing'
import {Rig, TextEffect} from "./Terminal";
import {useControls} from "leva";

const LoadingPercentageBar = ({x, shouldDisplay}) => {
  return (
    <Plane args={[0.1, 0.25]} position={[x, -0.4, 0.3]}>
      <meshStandardMaterial color="#f3f3f3" transparent opacity={shouldDisplay ? 1 : 0}/>
    </Plane>
  );
};

const LoadingBar = () => {
  // const { progress } = useProgress();
  const {progress} = useControls({
    progress: {
      min: 0,
      max: 100,
      step: 1,
      value: 0,
    }
  });

  return (
    <>
      <Text color="white" anchorX="center" anchorY="center" font={process.env.PUBLIC_URL + "/font/SourceCodePro-SemiBold.ttf"} position={[0, 0, 0.3]} fontSize={0.12}>
        Loading... {Math.floor(progress)}%
      </Text>
      <RoundedBox args={[2, 0.7, 0]} radius={0.05} smoothness={4} position={[0, -0.3, 0.1]}>
        <meshStandardMaterial color="#707070" transparent opacity={0.9}/>
        <Edges
          scale={1.1}
          threshold={12} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
          color="white"
          position={[-1.05, -0.3, 0.1]}
        />
      </RoundedBox>
      <LoadingPercentageBar x={-0.675} shouldDisplay={Math.floor(progress) >= 0}/>
      <LoadingPercentageBar x={-0.525} shouldDisplay={Math.floor(progress) >= 10}/>
      <LoadingPercentageBar x={-0.375} shouldDisplay={Math.floor(progress) >= 20}/>
      <LoadingPercentageBar x={-0.225} shouldDisplay={Math.floor(progress) >= 30}/>
      <LoadingPercentageBar x={-0.075} shouldDisplay={Math.floor(progress) >= 40}/>
      <LoadingPercentageBar x={0.075}  shouldDisplay={Math.floor(progress) >= 50}/>
      <LoadingPercentageBar x={0.225}  shouldDisplay={Math.floor(progress) >= 60}/>
      <LoadingPercentageBar x={0.375}  shouldDisplay={Math.floor(progress) >= 70}/>
      <LoadingPercentageBar x={0.525}  shouldDisplay={Math.floor(progress) >= 80}/>
      <LoadingPercentageBar x={0.675}  shouldDisplay={Math.floor(progress) >= 90}/>
    </>
  );
};

const TerminalLoader = () => {
  const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone.toUpperCase();
  const TIME = new Date().toTimeString().split(' ')[0].split(':').slice(0,2).join(':');

  const randomIP = () => {
    return (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255));
  };

  const baseText =
`$ grep root /etc/nmap
eoot:x:0.0:root:/root:/bin/bash

$ nmap -sT -A localhost
Starting nmap V. 3.00
Interesting ports on localhost.localdomain(127.0.0.1):
(The 1596 ports scanned but not shown below are in state: closed)
Port State Service
22/tcp open ssh
111/tcp open sunrpc
515/tcp open printer
834/tcp open unknown
60000/tcp open X11
Remote OS guesses: Windows 10 19044.2130 rc1-rc7

Nmap run completed -- 1 IP address (1 host up) scanned in 3 seconds

$ telnet -l root ${randomIP()}
CONNECTING...........100%

login: root
password: *****************

WELCOME TO KWG
${TIME} ${TIMEZONE} (LOCAL TIME)

$ `;

  return (
    <>
      <Canvas id="canvas" aspect={2.35} camera={{position: [0, 0, 2.5]}}>
        <color attach="background" args={["black"]}/>
        <ambientLight/>
        <pointLight position={[10, 10, 10]}/>
        <Rig>
          <TextEffect baseText={baseText}/>
          <LoadingBar/>
        </Rig>
        <EffectComposer>
          <Glitch
            delay={[1.5, 3.5]} // min and max glitch delay
            duration={[0.5, 1.5]} // min and max glitch duration
            strength={[0.05, 0.3]} // min and max glitch strength
            mode={GlitchMode.SPORADIC} // glitch mode
            active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
            ratio={0.9} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
          />
          <Scanline
            blendFunction={BlendFunction.OVERLAY} // blend mode
            density={2.25} // scanline density
            opacity={0.5}
          />
          <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.8}/>
        </EffectComposer>
      </Canvas>
    </>
  )
};

export default TerminalLoader;