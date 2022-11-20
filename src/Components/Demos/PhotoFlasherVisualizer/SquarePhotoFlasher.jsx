import React, {useLayoutEffect, useMemo, useRef, useState} from "react";
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {Image, Stats, useTexture} from "@react-three/drei";
import {useControls} from "leva";
import {lerp, randFloat, randInt} from "three/src/math/MathUtils";
import {Color} from "three";
import {perlin2, seed} from "../../../js/perlin";
import {Vector3} from "three/src/math/Vector3";
import CameraControls from 'camera-controls'
import * as THREE from 'three'
import ManualOrbitControlledPerspectiveCamera from "../../Common/ManualOrbitControlledPerspectiveCamera";

CameraControls.install({ THREE });

const WHITE = new Color(`rgb(255,255,255)`);
const IMG_URLS = Array.from({length: 20}, (_,i) => `${process.env.PUBLIC_URL}/img/rappers/${i+1}.jpg`);
let IMAGES;

let lastOffsetTimeChange = 0;
const applyOffset = (OFFSET, ref, width, height, time) => {
  const TIME_BETWEEN_CHANGE = 2;

  const HORIZ_VELOCITY = time*2;
  const VERTICAL_VELOCITY = time*0.1;

  const timeDiff = time - lastOffsetTimeChange;

  if (OFFSET) {
    if (timeDiff > TIME_BETWEEN_CHANGE) {
      lastOffsetTimeChange = time;

      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          const index = i*height+j;

          let perlin = Math.abs(perlin2(i / width + HORIZ_VELOCITY, j / height + VERTICAL_VELOCITY));

          if (perlin < 0.1 || (0.25 < perlin && perlin < 0.3) || (0.45 < perlin && perlin < 0.6) || Math.random() < 0.1) {
            ref.current.children[index].offsetPosition = index * 0.001
          } else {
            ref.current.children[index].offsetPosition = 1 + index * 0.001
          }
        }
      }
    } else {
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          const index = i*height+j;
          ref.current.children[index].position.z = lerp(ref.current.children[index].position.z, ref.current.children[index].offsetPosition, timeDiff / TIME_BETWEEN_CHANGE);
        }
      }
    }
  } else {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const index = i*height+j;
        ref.current.children[index].position.z = lerp(ref.current.children[index].position.z, index * 0.001, 0.1);
      }
    }
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
            ref.current.children[i*height+j].position.x = randFloat(-width/3, width/3);
            ref.current.children[i*height+j].position.y = randFloat(-height/3, height/3);
          }
        }
      }
    }
  } else {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        ref.current.children[i*height+j].position.x = lerp(ref.current.children[i*height+j].position.x, (i + SPACING*i) - (width+SPACING*width)/2 + 0.5 + SPACING/2, 0.05);
        ref.current.children[i*height+j].position.y = lerp(ref.current.children[i*height+j].position.y, (j + SPACING*j) - (height+SPACING*height)/2 + 0.5 + SPACING/2, 0.05);
      }
    }
  }
};

let lastGrayscale = false;
const applyGrayscale = (GRAYSCALE, KEEP_GRAYSCALE, ref, width, height, time) => {
  const TIME_BETWEEN_CHANGE = 4;
  const HORIZ_VELOCITY = time*2;
  const VERTICAL_VELOCITY = time*0.1;

  if (GRAYSCALE) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const index = i*height+j;

        if (!lastGrayscale) {
          ref.current.children[index].material.uniforms.grayscale.value = false;
        }

        if (!ref.current.children[index].lastGrayscaleChangeTime) {
          ref.current.children[index].lastGrayscaleChangeTime = 0;
        }

        if (time - ref.current.children[index].lastGrayscaleChangeTime > TIME_BETWEEN_CHANGE) {
          let perlin = Math.abs(perlin2(i / width + HORIZ_VELOCITY, j / height + VERTICAL_VELOCITY));
          if (perlin < 0.1) {
            ref.current.children[index].lastGrayscaleChangeTime = time;
            ref.current.children[index].material.uniforms.grayscale.value = KEEP_GRAYSCALE || !ref.current.children[index].material.uniforms.grayscale.value;
          }
        }
      }
    }
  } else {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        ref.current.children[i*height+j].material.uniforms.grayscale.value
          = KEEP_GRAYSCALE ? true
          :(ref.current.children[i*height+j].material.uniforms.grayscale.value ? Math.random() < 0.9 : false);
      }
    }
  }
  lastGrayscale = GRAYSCALE;
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

// const applyOpacitySmooth = (OPACITY_SMOOTH, ref, width, height, time) => {
//
//   if (OPACITY_SMOOTH) {
//     for (let i = 0; i < width; i++) {
//       for (let j = 0; j < height; j++) {
//         let perlin = Math.abs(perlin2(i/30 + time*2, j/50+time*0.01));
//         ref.current.children[i*height+j].material.uniforms.opacity.value = perlin;
//       }
//     }
//   } else {
//     for (let i = 0; i < width; i++) {
//       for (let j = 0; j < height; j++) {
//         ref.current.children[i*height+j].material.uniforms.opacity.value
//           = lerp(ref.current.children[i*height+j].material.uniforms.opacity.value, 1, 0.01);
//       }
//     }
//   }
// };

const applyOpacity = (OPACITY, ref, width, height, time) => {

  const TIME_BETWEEN_CHANGE = 0.01;
  const CHANCE_TO_NOT_UPDATE = 0.99;

  let HORIZ_VELOCITY = time*4;
  const VERTICAL_VELOCITY = time*0.1;

  if (OPACITY) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {

        if (!ref.current.children[i * height + j].lastOpacityChangeTime) {
          ref.current.children[i * height + j].lastOpacityChangeTime = 0;
        }

        if (time - ref.current.children[i * height + j].lastOpacityChangeTime > TIME_BETWEEN_CHANGE) {
          let perlin = Math.abs(perlin2(i / width/0.5 + HORIZ_VELOCITY, j / height/5 + VERTICAL_VELOCITY));

          if (Math.random() > CHANCE_TO_NOT_UPDATE) {
            ref.current.children[i * height + j].lastOpacityChangeTime = time + randFloat(0, 0.2);
            ref.current.children[i*height+j].material.uniforms.opacity.value = 1;
          } else if (perlin < 0.2) {
            ref.current.children[i * height + j].lastOpacityChangeTime = time;
            ref.current.children[i*height+j].material.uniforms.opacity.value = 0.1;
          } else {
            ref.current.children[i * height + j].lastOpacityChangeTime = time;
            ref.current.children[i*height+j].material.uniforms.opacity.value = lerp(ref.current.children[i*height+j].material.uniforms.opacity.value, 1, 0.1);
          }
        }
      }
    }
  } else {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        ref.current.children[i*height+j].material.uniforms.opacity.value
          = lerp(ref.current.children[i*height+j].material.uniforms.opacity.value, 1, 0.1);
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

const Controls = () => {
  const startPos = new Vector3();
  const endPos = new Vector3();
  const startTarget = new Vector3();
  const endTarget = new Vector3();

  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const controls = useMemo(() => new CameraControls(camera, gl.domElement), []);
  const clock = useThree((state) => state.clock);

  let lastTime = 0;

  return (
    useFrame((state, delta) => {
      const difBetweenTimes = clock.getElapsedTime() - lastTime;

      if (difBetweenTimes > 5) {
        const x1 = randInt(-5, 5);
        const x2 = randInt(-5, 5);
        const y1 = randInt(-5, 5);
        const y2 = randInt(-5, 5);

        startPos.set(x1, y1, 5);
        endPos.set(x2, y2, 5);
        startTarget.set(x1, y1, 0);
        endTarget.set(x2, y2, 0);

        lastTime = clock.getElapsedTime();
      }
      //
      // pos.set(Math.sin(clock.elapsedTime/3)*5, 0, 5);
      // look.set(Math.sin(clock.elapsedTime/3)*5, 0, 0);
      //
      // camera.position.lerp(pos, 1);
      // camera.updateProjectionMatrix();
      //
      // controls.setLookAt(camera.position.x, camera.position.y, camera.position.z, look.x, look.y, look.z, true);

      controls.lerpLookAt(
        startPos.x, startPos.y, startPos.z,
        startTarget.x, startTarget.y, startTarget.z,
        endPos.x, endPos.y, endPos.z,
        endTarget.x, endTarget.y, endTarget.z,
        difBetweenTimes/5,
        false
      );
      camera.updateProjectionMatrix();
      return controls.update(delta)
    })
  )
};

// EFFECTS
// -- Random Position & scale (otherwise default to position in a grid format)
// -- Grayscale
// -- Mix-in color
// -- opacity
// -- changeImage
// -- verticalOffset
const EffectController = ({width=5, height=4, }) => {
  const ref = useRef();

  IMAGES = useTexture(IMG_URLS);

  const {RANDOM_POSITION, GRAYSCALE, KEEP_GRAYSCALE, MIX_IN_COLOR, OPACITY, CHANGE_IMAGE, OFFSET} = useControls({
    RANDOM_POSITION: false,
    GRAYSCALE: false,
    KEEP_GRAYSCALE: false,
    MIX_IN_COLOR: false,
    OPACITY: false,
    CHANGE_IMAGE: false,
    OFFSET: false,
  });

  useLayoutEffect(() => {
    console.log(ref.current);
    seed(Math.random());
  });

  useFrame(({clock}) => {
    const time = clock.getElapsedTime();

    applyRandomPosition(RANDOM_POSITION, ref, width, height, time);
    applyGrayscale(GRAYSCALE, KEEP_GRAYSCALE, ref, width, height, time);
    applyMixInColor(MIX_IN_COLOR, ref, width, height, time);
    // applyOpacitySmooth(OPACITY, ref, width, height, time);
    applyOpacity(OPACITY, ref, width, height, time);
    applyChangeImage(CHANGE_IMAGE, ref, width, height, time);
    applyOffset(OFFSET, ref, width, height, time);
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
        {/*<ManualOrbitControlledPerspectiveCamera/>*/}
        <EffectController height={25} width={25}/>
        <Controls />
        <Stats/>
      </Canvas>
    </>
  )
};

export default SquarePhotoFlasher;