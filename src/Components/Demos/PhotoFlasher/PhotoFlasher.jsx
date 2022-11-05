import React, {useRef} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import ManualOrbitControlledPerspectiveCamera from "../../Common/ManualOrbitControlledPerspectiveCamera";
import {Image, Stats, useTexture} from "@react-three/drei";
import {randFloat, randInt} from "three/src/math/MathUtils";

const PhotoOverlay = ({z=0, timeOffset = 0}) => {
  const ref = useRef();

  const maps = useTexture( [
    process.env.PUBLIC_URL + '/img/random_photos/Overlay1.png',
    process.env.PUBLIC_URL + '/img/random_photos/Overlay2.png',
    process.env.PUBLIC_URL + '/img/random_photos/Overlay3.png',
    process.env.PUBLIC_URL + '/img/random_photos/Overlay4.png',
  ]);

  let prevTime = 0;
  let curTime;
  useFrame(({clock}) => {
    curTime = clock.getElapsedTime() + timeOffset;

    if (curTime - prevTime > randFloat(2, 4)) {
      prevTime = curTime;

      ref.current.visible = Math.random() > 0.6;

      const newTexture = maps[randInt(0, maps.length-1)];
      const newWidth = newTexture.source.data.naturalWidth;
      const newHeight = newTexture.source.data.naturalHeight;

      const scaled_width = 6;
      const scaled_height = 6;

      ref.current.material.uniforms.map.value = newTexture;
      ref.current.material.uniforms.scale.value = [scaled_width, scaled_height];
      ref.current.material.uniforms.imageBounds.value = [newWidth, newHeight];

      ref.current.scale.x = scaled_width;
      ref.current.scale.y = scaled_height;
    }
  });
  return <Image ref={ref} position={[0, 0, z]} transparent grayscale={1} url={process.env.PUBLIC_URL + `/img/random_photos/bg1.jpg`}/>
};

const PhotoBackground = ({z=0, timeOffset = 0}) => {
  const ref = useRef();

  const maps = useTexture( [
    process.env.PUBLIC_URL + '/img/random_photos/bg1.jpg',
    process.env.PUBLIC_URL + '/img/random_photos/bg2.jpg',
    process.env.PUBLIC_URL + '/img/random_photos/bg3.jpg',
    process.env.PUBLIC_URL + '/img/random_photos/bg4.jpg',
    process.env.PUBLIC_URL + '/img/random_photos/bg5.jpg',
  ]);

  let prevTime = 0;
  let curTime;
  useFrame(({clock}) => {
    curTime = clock.getElapsedTime() + timeOffset;

    if (curTime - prevTime > randFloat(2, 4)) {
      prevTime = curTime;

      ref.current.visible = Math.random() > 0.6;

      const newTexture = maps[randInt(0, maps.length-1)];
      const newWidth = newTexture.source.data.naturalWidth;
      const newHeight = newTexture.source.data.naturalHeight;

      const scaled_width = 6;
      const scaled_height = 6;

      ref.current.material.uniforms.map.value = newTexture;
      ref.current.material.uniforms.scale.value = [scaled_width, scaled_height];
      ref.current.material.uniforms.imageBounds.value = [newWidth, newHeight];

      ref.current.scale.x = scaled_width;
      ref.current.scale.y = scaled_height;
    }
  });
  return <Image ref={ref} position={[0, 0, z]} grayscale={1} url={process.env.PUBLIC_URL + `/img/random_photos/bg1.jpg`}/>
};

const PhotoPlane = ({z=0, timeOffset = 0}) => {
  const ref = useRef();

  const maps = useTexture( [
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
    curTime = clock.getElapsedTime() + timeOffset;

    if (curTime - prevTime > randFloat(1, 2)) {
      prevTime = curTime;

      ref.current.visible = Math.random() > 0.4;

      ref.current.material.zoom = randFloat(1, 3);

      const newTexture = maps[randInt(0, maps.length-1)];
      const newWidth = newTexture.source.data.naturalWidth;
      const newHeight = newTexture.source.data.naturalHeight;

      const SCALE_FACTOR = randFloat(1, 2);
      const scaled_width = SCALE_FACTOR;
      const scaled_height = SCALE_FACTOR*newHeight/newWidth;

      ref.current.material.uniforms.map.value = newTexture;
      ref.current.material.uniforms.scale.value = [scaled_width, scaled_height];
      ref.current.material.uniforms.imageBounds.value = [newWidth, newHeight];

      ref.current.scale.x = scaled_width;
      ref.current.scale.y = scaled_height;

      ref.current.position.x = randFloat(-1.5, 1.5);
      ref.current.position.y = randFloat(-1.5, 1.5);
    }
  });
  return <Image ref={ref} position={[0, 0, z]} grayscale={1} url={process.env.PUBLIC_URL + `/img/random_photos/1.jpg`}/>
};

const PhotoFlasher = () => {
  return (
    <>
      <Canvas id="canvas" aspect={2.35}>
        <color attach="background" args={["black"]}/>
        <ambientLight/>
        <pointLight position={[10, 10, 10]}/>
        <ManualOrbitControlledPerspectiveCamera/>
        <PhotoBackground z={-0.1} timeOffset={-0.4}/>
        <PhotoPlane z={0}/>
        <PhotoPlane z={.01} timeOffset={0.4}/>
        <PhotoPlane z={.02} timeOffset={0.8}/>
        <PhotoPlane z={.03} timeOffset={1.2}/>
        <PhotoOverlay z={.04} timeOffset={1.6}/>
        <Stats/>
      </Canvas>
    </>
  )
};

export default PhotoFlasher;