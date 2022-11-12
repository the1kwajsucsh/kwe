import React, {useLayoutEffect, useRef} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {Image, Stats, useTexture} from "@react-three/drei";
import {useControls} from "leva";
import {randFloat, randInt} from "three/src/math/MathUtils";
import {Color} from "three"
import ManualOrbitControlledPerspectiveCamera from "../../Common/ManualOrbitControlledPerspectiveCamera";

const IMG_URLS = Array.from({length: 20}, (_,i) => `${process.env.PUBLIC_URL}/img/colors/${i+1}.jpg`);
let IMAGES;

const applyGroupMove = (GROUP_MOVE, ref) => {
  if (GROUP_MOVE) {
    ref.current.position.x -= 0.01;

    if (ref.current.position.x < -3) {
      ref.current.position.x = 3;
    }
  } else {
    ref.current.position.x = 0;
    ref.current.position.y = 0;
    ref.current.position.z = 0;
  }
};

let randomPositionLastTime = 0;
const applyRandomPosition = (RANDOM_POSITION, ref, width, height, time) => {
  const SPACING = 0.1;
  const TIME_BETWEEN_CHANGE = 0.05;

  if (RANDOM_POSITION) {

    if (time - randomPositionLastTime > TIME_BETWEEN_CHANGE) {
      randomPositionLastTime = time;

      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (Math.random() > 0.8) {
            ref.current.children[i*height+j].position.x = randFloat(-3, 3);
            ref.current.children[i*height+j].position.y = randFloat(-3, 3);
            ref.current.children[i*height+j].position.z = (i*height+j) * 0.001;
          }
        }
      }
    }
  } else {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        ref.current.children[i*height+j].position.x = (i + SPACING*i) - (width+SPACING*width)/2 + 0.5 + SPACING/2;
        ref.current.children[i*height+j].position.y = (j + SPACING*j) - (height+SPACING*height)/2 + 0.5 + SPACING/2;
        ref.current.children[i*height+j].position.z = 0;
      }
    }
  }
};

const applyGrayscale = (GRAYSCALE, ref, width, height, time) => {
  if (GRAYSCALE) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        ref.current.children[i*height+j].material.uniforms.grayscale.value = true;
      }
    }
  } else {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        ref.current.children[i*height+j].material.uniforms.grayscale.value = false;
      }
    }
  }
};

let mixInColorLastTime = 0;
const applyMixInColor = (MIX_IN_COLOR, ref, width, height, time) => {
  const TIME_BETWEEN_CHANGE = 0.5;

  if (MIX_IN_COLOR) {
    if (time - mixInColorLastTime > TIME_BETWEEN_CHANGE) {
      mixInColorLastTime = time;
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          ref.current.children[i * height + j].material.uniforms.color.value = new Color(`rgb(${randInt(0, 255)},${randInt(0, 255)},${randInt(0, 255)})`);
        }
      }
    }
  } else {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        ref.current.children[i * height + j].material.uniforms.color.value = new Color(`rgb(255,255,255)`);
      }
    }
  }
};

let opacityLastTime = 0;
const applyOpacity = (OPACITY, ref, width, height, time) => {
  const TIME_BETWEEN_CHANGE = 0.5;

  if (OPACITY) {
    if (time - opacityLastTime > TIME_BETWEEN_CHANGE) {
      opacityLastTime = time;
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          ref.current.children[i * height + j].material.uniforms.opacity.value = Math.random();
        }
      }
    }
  } else {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        ref.current.children[i * height + j].material.uniforms.opacity.value = 1;
      }
    }
  }
};

let changeImageLastTime = 0;
const applyChangeImage = (CHANGE_IMAGE, ref, width, height, time) => {
  const TIME_BETWEEN_CHANGE = 0.5;

  if (CHANGE_IMAGE) {
    if (time - changeImageLastTime > TIME_BETWEEN_CHANGE) {
      changeImageLastTime = time;
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          ref.current.children[i * height + j].material.uniforms.map.value = IMAGES[randInt(0, IMAGES.length-1)]
        }
      }
    }
  }
};

// EFFECTS
// -- Group Move (changing position of group)
// -- Random Position & scale (otherwise default to position in a grid format)
// -- Grayscale
// -- Mix-in color
// -- opacity
// -- changeImage
const EffectController = ({width=5, height=4, }) => {
  const ref = useRef();

  IMAGES = useTexture(IMG_URLS);

  const {GROUP_MOVE, RANDOM_POSITION, GRAYSCALE, MIX_IN_COLOR, OPACITY, CHANGE_IMAGE} = useControls({
    GROUP_MOVE: false,
    RANDOM_POSITION: false,
    GRAYSCALE: false,
    MIX_IN_COLOR: false,
    OPACITY: false,
    CHANGE_IMAGE: false,
  });

  useLayoutEffect(() => {
    console.log(ref.current);
  });

  useFrame(({clock}) => {
    const time = clock.getElapsedTime();

    applyGroupMove(GROUP_MOVE, ref);
    applyRandomPosition(RANDOM_POSITION, ref, width, height, time);
    applyGrayscale(GRAYSCALE, ref, width, height, time);
    applyMixInColor(MIX_IN_COLOR, ref, width, height, time);
    applyOpacity(OPACITY, ref, width, height, time);
    applyChangeImage(CHANGE_IMAGE, ref, width, height, time);
  });

  return (
    <group ref={ref}>
      {[...Array(width*height)].map((_, index) => <Image key={index} transparent texture={IMAGES[randInt(0, IMAGES.length-1)]}/>)}
    </group>
  );
};

const SquarePhotoFlasher = () => {
  return (
    <>
      <Canvas id="canvas" aspect={2.35}>
        <color attach="background" args={["black"]}/>
        <ManualOrbitControlledPerspectiveCamera/>
        <EffectController height={10} width={10}/>
        <Stats/>
      </Canvas>
    </>
  )
};

export default SquarePhotoFlasher;