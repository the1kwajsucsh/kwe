import React, {useLayoutEffect, useRef} from "react";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {useControls} from "leva";
import {Clock} from "three";

function ManualOrbitControlledPerspectiveCamera() {
  const camRef = useRef();
  const orbitControlsRef = useRef();

  const clock = new Clock(true);
  let levaUpdate = true;

  const [, setPosition] = useControls(() => ({
    position: {
      value: {x: 0, y: 0.5, z: 5},
      onChange: (value) => {
        if (levaUpdate) {
          camRef.current.position.set(value.x, value.y, value.z);
        }
      },
    },
  }));

  const [, setTarget] = useControls(() => ({
    target: {
      value: {x: 0, y: 0.5, z: 5},
      onChange: (value) => {
        if (levaUpdate) {
          orbitControlsRef.current.target.set(value.x, value.y, value.z);
        }
      },
    },
  }));

  useLayoutEffect(() => {
    console.log("Re-rendered");
  });

  let lastTime = 0, curTime;
  let orbitControlsChange = () => {
    curTime = clock.getElapsedTime();
    if (curTime - lastTime > 1/60) {
      lastTime = curTime;
      levaUpdate = false;
      setPosition({position: {
          x: camRef.current.position.x,
          y: camRef.current.position.y,
          z: camRef.current.position.z
        }});
      setTarget({target: {
          x: orbitControlsRef.current.target.x,
          y: orbitControlsRef.current.target.y,
          z: orbitControlsRef.current.target.z
        }});
      levaUpdate = true;
    }
  };

  return (
    <>
      <OrbitControls ref={orbitControlsRef} onChange={orbitControlsChange}/>
      <PerspectiveCamera ref={camRef} makeDefault position={[0, 0.5, 5]}/>
    </>
  );
}

export default ManualOrbitControlledPerspectiveCamera;