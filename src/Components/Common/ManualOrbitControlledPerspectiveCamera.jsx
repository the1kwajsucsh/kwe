import React, {useRef} from "react";
import {Line, OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {useControls} from "leva";
import {Clock} from "three";

function ManualOrbitControlledPerspectiveCamera() {
  const camRef = useRef();
  const orbitControlsRef = useRef();
  const targetRef = useRef();

  const clock = new Clock(true);
  let levaUpdate = true;

  const [{Position}, setPosition] = useControls(() => ({
    Position: {
      value: {x: 0, y: 0.5, z: 5},
      onChange: (value) => {
        if (levaUpdate) {
          camRef.current.position.set(value.x, value.y, value.z);
        }
      },
      transient: false,
    },
  }));

  const [{Target},setTarget] = useControls(() => ({
    Target: {
      value: {x: 0, y: 0.5, z: 5},
      onChange: (value) => {
        if (levaUpdate) {
          orbitControlsRef.current.target.set(value.x, value.y, value.z);
        }
        targetRef.current.position.set(value.x, value.y, value.z);
      },
      transient: false,
    },
  }));

  useControls(() => ({
    'Display Target' : {
      value: true,
      onChange: value => targetRef.current.visible = value
    },
  }));

  let lastTime = 0, curTime;
  let orbitControlsChange = () => {
    curTime = clock.getElapsedTime();
    if (curTime - lastTime > 1/60) {
      lastTime = curTime;
      levaUpdate = false;

      if (camRef.current.position.distanceTo(Position) > 0) {
        setPosition({
          Position: {
            x: camRef.current.position.x,
            y: camRef.current.position.y,
            z: camRef.current.position.z
          }
        });
      }

      if (orbitControlsRef.current.target.distanceTo(Target) > 0) {
        setTarget({Target: {
            x: orbitControlsRef.current.target.x,
            y: orbitControlsRef.current.target.y,
            z: orbitControlsRef.current.target.z
          }});
      }

      levaUpdate = true;
    }
  };

  return (
    <>
      <OrbitControls ref={orbitControlsRef} onChange={orbitControlsChange}/>
      <PerspectiveCamera ref={camRef} makeDefault position={[0, 0, 5]}/>
      <group ref={targetRef}>
        <Line points={[[-0.5, 0, 0], [0.5, 0, 0]]} color="gray" lineWidth={1} />
        <Line points={[[0, -0.5, 0], [0, 0.5, 0]]} color="gray" lineWidth={1}/>
        <Line points={[[0, 0, -0.5], [0, 0, 0.5]]} color="gray" lineWidth={1}/>
      </group>
    </>
  );
}

export default ManualOrbitControlledPerspectiveCamera;