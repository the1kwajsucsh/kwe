import {useFrame, useThree} from "@react-three/fiber";
import React, {useRef, useState} from "react";
import {PerspectiveCamera, Text} from "@react-three/drei";
import {Bloom, EffectComposer, Glitch, Scanline} from "@react-three/postprocessing";
import { GlitchMode, BlendFunction } from 'postprocessing'
import {randInt} from "three/src/math/MathUtils";
import {Vector3} from "three/src/math/Vector3";
import {MathUtils} from "three";

export const TextEffect = ({baseText}) => {
  const [text, setText] = useState("_");
  const [index, setIndex] = useState(0);
  const [cursorTime, setCursorTime] = useState(0);

  useFrame(({clock}) => {
    setCursorTime(Math.round(clock.getElapsedTime()*10)/10);
    const RESET = (index > baseText.length + 360) ? -index : 0;

    let ENDING_APPEND = "_";
    if (index > baseText.length) {
      ENDING_APPEND = cursorTime%1  < 0.5 ? "_" : "";
    }

    setText(baseText.substring(0, index) + ENDING_APPEND);
    setIndex(index + randInt(1, 3) + RESET);
  });

  return (
    <>
      <Text color="white" anchorX="left" anchorY="top" maxWidth={5} lineHeight={1.2} font={process.env.PUBLIC_URL + "/font/SourceCodePro-SemiBold.ttf"} position={[-2.5, 1.6, 0]}>
        {text}
      </Text>
    </>
  );
};

export function Rig({ children }) {
  const ref = useRef();
  const vec = new Vector3();
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 0.5, 0, 4), 0.05);
    ref.current.position.lerp(vec.set(mouse.x * 0.3, mouse.y * 0.05, 0), 0.1);
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, (-mouse.x * Math.PI) / 50, 0.1)
  });
  return <group ref={ref}>{children}</group>
}


const Terminal = () => {
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
      <PerspectiveCamera makeDefault position={[0, 0, 5]}/>
      <color attach="background" args={["black"]}/>
      <ambientLight/>
      <pointLight position={[10, 10, 10]}/>
      <Rig>
        <TextEffect baseText={baseText}/>
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
    </>
  )
};

export default Terminal;