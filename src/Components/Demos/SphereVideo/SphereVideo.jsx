import React, {useRef} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {Circle, OrbitControls, Sphere, useVideoTexture} from "@react-three/drei";
import {SphereVideoShader} from "./SphereVideoShader";
import {UniformsUtils} from "three";
import {CircleVideoShader} from "./CircleVideoShader";
import {DoubleSide} from "three/src/constants";

function CircleVideoMaterial({ texture }) {
  const shaderRef = useRef();

  useFrame(({clock}) => {
    shaderRef.current.uniforms.time.value = clock.elapsedTime;
  });

  return (
    <shaderMaterial
      attach="material"
      ref={shaderRef}
      transparent
      side={DoubleSide}
      args={[
        {
          ...CircleVideoShader,
          uniforms: UniformsUtils.clone(CircleVideoShader.uniforms),
          extensions : {
            derivatives: "#extension GL_OES_standard_derivatives: enabled"
          },
        }
      ]}
      uniforms-map-value={texture}
    />
  );
}

function SphereVideoMaterial({ texture }) {
  const shaderRef = useRef();

  useFrame(({clock}) => {
    shaderRef.current.uniforms.time.value = clock.elapsedTime;
  });

  return (
    <shaderMaterial
      attach="material"
      ref={shaderRef}
      transparent
      args={[
        {
          ...SphereVideoShader,
          uniforms: UniformsUtils.clone(SphereVideoShader.uniforms),
          extensions : {
            derivatives: "#extension GL_OES_standard_derivatives: enabled"
          },
        }
      ]}
      uniforms-map-value={texture}
    />
  );
}

const SphereVideo = () => {
  const texture = useVideoTexture(process.env.PUBLIC_URL + "/video/05_JESUS_WALKS.mp4");
  return (
    <group position={[-2, 0, 0]}>
      <Sphere args={[1, 100, 100, 1.5*Math.PI]}>
        <SphereVideoMaterial texture={texture} />
      </Sphere>
    </group>
  )
};

const CircleVideo = () => {
  const texture = useVideoTexture(process.env.PUBLIC_URL + "/video/05_JESUS_WALKS.mp4");
  return (
    <group position={[2, -1.5, 0]}>
      <Circle args={[2.5, 100]}>
        <CircleVideoMaterial texture={texture}/>
      </Circle>
    </group>
  )
};

const SphereVideoScene = () => {
  return (
    <>
      <Canvas id="canvas" aspect={2.35} camera={{position: [0, 0, 9]}}>
        <color attach="background" args={["gray"]}/>
        <ambientLight/>
        <pointLight position={[10, 10, 10]}/>
        <OrbitControls/>
        <SphereVideo/>
        <CircleVideo/>
      </Canvas>
    </>
  )
};

export default SphereVideoScene;