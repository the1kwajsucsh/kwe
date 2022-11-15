import React, {useLayoutEffect, useRef} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {Image, Stats, useTexture} from "@react-three/drei";
import {useControls} from "leva";
import {lerp, randFloat, randInt} from "three/src/math/MathUtils";
import {Color} from "three"
import ManualOrbitControlledPerspectiveCamera from "../../Common/ManualOrbitControlledPerspectiveCamera";
import {perlin2, seed} from "../../../js/perlin";

const WHITE = new Color(`rgb(255,255,255)`);
const IMG_URLS = Array.from({length: 20}, (_,i) => `${process.env.PUBLIC_URL}/img/rappers/${i+1}.jpg`);
let IMAGES;

let randomPositionLastTime = 0;
const applyRandomPosition = (RANDOM_POSITION, ref, width, height, time) => {
  const SPACING = 0.1;
  const TIME_BETWEEN_CHANGE = 0.1;

  if (RANDOM_POSITION) {
    if (time - randomPositionLastTime > TIME_BETWEEN_CHANGE) {
      randomPositionLastTime = time;

      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (Math.random() > 0.8) {
            ref.current.children[i*height+j].position.x = randFloat(-width/3, width/3);
            ref.current.children[i*height+j].position.y = randFloat(-height/3, height/3);
            ref.current.children[i*height+j].position.z = (i*height+j) * 0.001;
          }
        }
      }
    }
  } else {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        ref.current.children[i*height+j].position.x = lerp(ref.current.children[i*height+j].position.x, (i + SPACING*i) - (width+SPACING*width)/2 + 0.5 + SPACING/2, 0.05);
        ref.current.children[i*height+j].position.y = lerp(ref.current.children[i*height+j].position.y, (j + SPACING*j) - (height+SPACING*height)/2 + 0.5 + SPACING/2, 0.05);
        ref.current.children[i*height+j].position.z = lerp(ref.current.children[i*height+j].position.z, 0, 0.01);
      }
    }
  }
};

const applyGrayscale = (GRAYSCALE, ref, width, height, time) => {
  if (GRAYSCALE) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let perlin = Math.abs(perlin2(i/30 + time*2, j/50+time*0.01));
        ref.current.children[i*height+j].material.uniforms.grayscale.value = perlin < 0.2;
      }
    }
  } else {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        ref.current.children[i*height+j].material.uniforms.grayscale.value
          = ref.current.children[i*height+j].material.uniforms.grayscale.value ? Math.random() < 0.9 : false;
      }
    }
  }
};

let mixInColorLastTime = 0;
const applyMixInColor = (MIX_IN_COLOR, ref, width, height, time) => {
  const TIME_BETWEEN_CHANGE = 0.03;

  if (MIX_IN_COLOR) {
    if (time - mixInColorLastTime > TIME_BETWEEN_CHANGE) {
      mixInColorLastTime = time;
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          let perlin = Math.abs(perlin2(i/30 + time*2, j/50+time*0.01));
          ref.current.children[i * height + j].material.uniforms.color.value = perlin < 0.1 ? new Color(`rgb(${randInt(0, 255)},${randInt(0, 255)},${randInt(0, 255)})`) : WHITE;
        }
      }
    }
  } else {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        ref.current.children[i*height+j].material.uniforms.color.value
          = ref.current.children[i*height+j].material.uniforms.color.value.lerp(WHITE, 0.01);
      }
    }
  }
};

const applyOpacity = (OPACITY, ref, width, height, time) => {

  if (OPACITY) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        let perlin = Math.abs(perlin2(i/30 + time*2, j/50+time*0.01));
        ref.current.children[i*height+j].material.uniforms.opacity.value = perlin;
      }
    }
  } else {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        ref.current.children[i*height+j].material.uniforms.opacity.value
          = lerp(ref.current.children[i*height+j].material.uniforms.opacity.value, 1, 0.01);
      }
    }
  }
};

const applyChangeImage = (CHANGE_IMAGE, ref, width, height, time) => {
  // high time between change + low chance to not update ==> solid wave effect
  // low time between change + high chance to not update ==> Random updates
  const TIME_BETWEEN_CHANGE = 0.1;
  const CHANCE_TO_NOT_UPDATE = 0.7;

  const HORIZ_VELOCITY = time*2;
  const VERTICAL_VELOCITY = time*0.1;

  if (CHANGE_IMAGE) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {

        if (!ref.current.children[i * height + j].lastImageChangeTime) {
          ref.current.children[i * height + j].lastImageChangeTime = 0;
        }

        if (time - ref.current.children[i * height + j].lastImageChangeTime > TIME_BETWEEN_CHANGE) {
          let perlin = Math.abs(perlin2(i / width + HORIZ_VELOCITY, j / height + VERTICAL_VELOCITY));
          if (perlin < 0.1 && Math.random() > CHANCE_TO_NOT_UPDATE) {
            ref.current.children[i * height + j].lastImageChangeTime = time;
            ref.current.children[i * height + j].material.uniforms.map.value = IMAGES[randInt(0, IMAGES.length - 1)]
          }
        }
      }
    }
  }
};

// EFFECTS
// -- Random Position & scale (otherwise default to position in a grid format)
// -- Grayscale
// -- Mix-in color
// -- opacity
// -- changeImage
const EffectController = ({width=5, height=4, }) => {
  const ref = useRef();

  IMAGES = useTexture(IMG_URLS);

  const {RANDOM_POSITION, GRAYSCALE, MIX_IN_COLOR, OPACITY, CHANGE_IMAGE} = useControls({
    RANDOM_POSITION: false,
    GRAYSCALE: false,
    MIX_IN_COLOR: false,
    OPACITY: false,
    CHANGE_IMAGE: false,
  });

  useLayoutEffect(() => {
    console.log(ref.current);
    seed(Math.random());
  });

  useFrame(({clock}) => {
    const time = clock.getElapsedTime();

    // applyGroupMove(GROUP_MOVE, ref);
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
        <EffectController height={15} width={30}/>
        <Stats/>
      </Canvas>
    </>
  )
};

export default SquarePhotoFlasher;