import React, {useLayoutEffect, useRef} from "react";
import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import ManualOrbitControlledPerspectiveCamera from "../../Common/ManualOrbitControlledPerspectiveCamera";
import {Image} from "@react-three/drei";
import {randFloat, randInt} from "three/src/math/MathUtils";
import {TextureLoader} from "three";

const PhotoPlane = () => {
  const ref = useRef();

  const maps = useLoader(TextureLoader, [
    process.env.PUBLIC_URL + '/img/random_photos/1.jpg',
    process.env.PUBLIC_URL + '/img/random_photos/2.jpg',
    process.env.PUBLIC_URL + '/img/random_photos/3.jpg',
    process.env.PUBLIC_URL + '/img/random_photos/4.jpg',
    process.env.PUBLIC_URL + '/img/random_photos/5.jpg',
    process.env.PUBLIC_URL + '/img/random_photos/6.jpg',
    process.env.PUBLIC_URL + '/img/random_photos/7.jpg',
    process.env.PUBLIC_URL + '/img/random_photos/8.jpg',
    process.env.PUBLIC_URL + '/img/random_photos/9.jpg',
    process.env.PUBLIC_URL + '/img/random_photos/10.jpg',
  ]);

  let prevTime = 0;
  let curTime;
  useFrame(({clock}) => {
    curTime = clock.getElapsedTime();

    if (curTime - prevTime > 0.3) {
      prevTime = curTime;

      ref.current.material.zoom = Math.random() + 1; // 1 and higher


      const newTexture = maps[randInt(0, 9)];
      const newWidth = newTexture.source.data.naturalWidth;
      const newHeight = newTexture.source.data.naturalHeight;

      const SCALE_FACTOR = randFloat(1, 3);
      const scaled_width = SCALE_FACTOR;
      const scaled_height = SCALE_FACTOR*newHeight/newWidth;

      ref.current.material.uniforms.map.value = newTexture;
      ref.current.material.uniforms.scale.value = [scaled_width, scaled_height];
      ref.current.material.uniforms.imageBounds.value = [newWidth, newHeight];

      ref.current.scale.x = scaled_width;
      ref.current.scale.y = scaled_height;
    }
  });
  return <Image ref={ref} transparent grayscale={1} url={process.env.PUBLIC_URL + `/img/random_photos/1.jpg`}/>
};

const PhotoFlasher = () => {
  return (
    <>
      <Canvas id="canvas" aspect={2.35}>
        <color attach="background" args={["black"]}/>
        <ambientLight/>
        <pointLight position={[10, 10, 10]}/>
        <ManualOrbitControlledPerspectiveCamera/>
        <PhotoPlane/>
      </Canvas>
    </>
  )
};

export default PhotoFlasher;