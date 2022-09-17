import React from "react";
import {Canvas} from "@react-three/fiber";
import {OrbitControls, Sphere, useVideoTexture} from "@react-three/drei";
import {SphereVideoShader} from "./SphereVideoShader";
import {UniformsUtils} from "three";

function VideoMaterial({ texture }) {
  return (
    <shaderMaterial
      attach="material"
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
    <Sphere>
      <VideoMaterial texture={texture} />
    </Sphere>
  )
};

const SphereVideoScene = () => {
  return (
    <>
      <Canvas id="canvas" aspect={2.35}>
        <color attach="background" args={["gray"]}/>
        <ambientLight/>
        <pointLight position={[10, 10, 10]}/>
        <OrbitControls/>
        <SphereVideo/>
      </Canvas>
    </>
  )
};

export default SphereVideoScene;