import React, {useEffect, useRef} from "react";
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {Image, Stats, useTexture} from "@react-three/drei";
import {randFloat, randInt} from "three/src/math/MathUtils";
import {suspend} from "suspend-react";
import {createAudio} from "../../../js/audioAnalyzer/audioAnalyzer";
import {Vector3} from "three/src/math/Vector3";
import {MathUtils} from "three";

let lastIsBeat = false;
let beat = false;
let meter;
let photoCoords;

const photoCoordsDefault = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0
};

const doRectanglesOverlap = (index1, index2) => {
  if (index1 === index2) {
    return false;
  }

  const r1 = photoCoords[index1];
  const r2 = photoCoords[index2];

  // One rec has 0 area
  if (r1 === photoCoordsDefault || r2 === photoCoordsDefault) {
    return false;
  }

  // Check if rectangle is to the sides or above/below the other.
  if (r1.right < r2.left || r1.left > r2.right || r1.bottom > r2.top || r1.top < r2.bottom) {
    return false;
  }

  return true;
};

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

    if (beat && curTime - prevTime > randFloat(2, 4)) {
      prevTime = curTime;

      ref.current.visible = meter > -55 && Math.random() > 0.6;

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
  return <Image ref={ref} position={[0, 0, z]} transparent opacity={0.8} grayscale url={process.env.PUBLIC_URL + `/img/random_photos/bg1.jpg`}/>
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

    if (beat && curTime - prevTime > randFloat(2, 4)) {
      prevTime = curTime;

      ref.current.visible = meter > -55 && Math.random() > 0.2;

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
  return <Image ref={ref} position={[0, 0, z]} grayscale color={"darkgrey"} url={process.env.PUBLIC_URL + `/img/random_photos/bg1.jpg`}/>
};

const PhotoPlane = ({index}) => {
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

  let shouldRerender = false;
  let prevTime = 0;
  let curTime;
  useFrame(({clock}) => {
    curTime = clock.getElapsedTime();

    if (beat && curTime - prevTime > 0.3) {
      prevTime = curTime;

      let shouldHide =  meter < -50 || Math.random() < 0.4;

      if (shouldHide) {
        photoCoords[index] = photoCoordsDefault;
        shouldRerender = true;
        ref.current.visible =  false;
      }

      if (shouldRerender && Math.random() > 0.6) {
        shouldRerender = false;
        ref.current.visible = true;
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
        ref.current.material.uniforms.grayscale.value =  Math.random() < 0.95;

        ref.current.scale.x = scaled_width;
        ref.current.scale.y = scaled_height;

        const MAX_ATTEMPTS = 5;
        for (let i = 0; i < MAX_ATTEMPTS; i++) {
          ref.current.position.x = randFloat(-2, 2);
          ref.current.position.y = randFloat(-2, 2);

          photoCoords[index] = {
            left: ref.current.position.x - scaled_width/2,
            top: ref.current.position.y + scaled_height/2,
            right: ref.current.position.x + scaled_width/2,
            bottom: ref.current.position.y - scaled_height/2,
          };

          // Try to prevent overlaps
          let isAnyOverlap = false;
          for (let i = 0; i < photoCoords.length; i++) {
            isAnyOverlap = isAnyOverlap || doRectanglesOverlap(index, i);
          }

          if (!isAnyOverlap) {
            break;
          }

          if (i === MAX_ATTEMPTS - 1) {
            photoCoords[index] = photoCoordsDefault;
            shouldRerender = true;
            ref.current.visible =  false;
          }
        }

        ref.current.position.z = 0.005 * index;
      }
    }
  });
  return <Image ref={ref} position={[0, 0, 0]} grayscale url={process.env.PUBLIC_URL + `/img/random_photos/1.jpg`}/>
};

const PhotoEffect = ({track}) => {
  const { gain, context, update } = suspend(() => createAudio(track, false), [track]);
  const numPlanes = 5;

  useEffect(() => {
    // Connect the gain node, which plays the audio
    gain.connect(context.destination);

    // Disconnect it on dismount
    return () => {
      gain.disconnect();
    }
  }, [gain, context]);

  // let lastIsBeat = false;
  useFrame(() => {
    const {isBeat, meter: isMeter} = update();

    // Only update the beat if it changes -- to remove triggering effect multiple times per beat
    if ((!lastIsBeat && isBeat) || (lastIsBeat && !isBeat)) {
      beat = isBeat;
      meter = isMeter;
    }

    lastIsBeat = isBeat;
  });

  photoCoords = Array(numPlanes).fill(photoCoordsDefault);

  return (
    <>
      <PhotoBackground z={-0.1}/>
      {[...Array(numPlanes)].map((e, index) => <PhotoPlane key={index} index={index}/>)}
      <PhotoOverlay z={.04}/>
    </>
  )
};

export function Rig({ children }) {
  const ref = useRef();
  const vec = new Vector3();
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 0.5, 0, 3), 0.05);
    ref.current.position.lerp(vec.set(mouse.x * 0.3, mouse.y * 0.05, 0), 0.1);
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, (-mouse.x * Math.PI) / 50, 0.1)
  });
  return <group ref={ref}>{children}</group>
}

const PhotoFlasher = () => {
  return (
    <>
      <Canvas id="canvas" aspect={2.35}>
        <color attach="background" args={["black"]}/>
        <Rig>
          <PhotoEffect track={process.env.PUBLIC_URL + "/local/GKTF/05_MAAD_WORLD.mp3"}/>
        </Rig>
        <Stats/>
      </Canvas>
    </>
  )
};

export default PhotoFlasher;