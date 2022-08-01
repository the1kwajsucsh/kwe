import {MathUtils} from "three";
import VoiceMessage from "../Audio/VoiceMessage";
import React from "react";
import PhoneCanvas from "../PhoneCanvas/PhoneCanvas";

export const determineResponse = (responseType) => {
  switch(responseType) {
    case "GREETING":
      return buildGreetingResponse();
    case "AUDIO":
    case "2049":
      return build2049Response();
    case "DIET":
      return buildDietResponse();
    case "GKTF":
      return buildGKTFResponse();
    case "IMAGE":
      return buildImageResponse();
    case "CANVAS":
      return buildCanvasResponse();
    default:
      return undefined;
  }
};

const buildGreetingResponse = () => {
  const responses = ["Hello", "Hey", "Ayoooooo", "Whattup", "????"];
  return [{
    type: "GREETING",
    content: responses[MathUtils.randInt(0, responses.length - 1)],
    isLast: true,
  }];
};

const build2049Response = () => {
  const isLocal = window.location.hostname === "localhost";
  const responses = [
    "/local/2049/01_INTRO_(CHARLIE_HEAT_VERSION).mp3",
    "/local/2049/02_POWER.mp3",
    "/local/2049/03_HOLD_MY_LIQUOR.mp3",
    "/local/2049/04_LIFT_YOURSELF.mp3",
    "/local/2049/05_JESUS_WALKS.mp3",
    "/local/2049/06_WOLVES_PT.1.mp3",
    "/local/2049/07_WOLVES_PT.2.mp3",
    "/local/2049/08_CANT_TELL_ME_NOTHIN.mp3",
    "/local/2049/09_I_LOVE_IT.mp3",
    "/local/2049/10_SAY_YOU_WILL_(FREESTYLE).mp3",
    "/local/2049/11_AOTL.mp3",
    "/local/2049/12_BLACK_SKINHEAD.mp3",
    "/local/2049/13_FSMH.mp3",
    "/local/2049/14_HOMECOMING.mp3",
    "/local/2049/15_RUNAWAY.mp3",
    "/local/2049/16_BOUND_2049.mp3",
    "/local/2049/17_TOUCH_THE_SKY.mp3",
  ];

  const audioSource = process.env.PUBLIC_URL + (isLocal ? responses[MathUtils.randInt(0, responses.length - 1)] : "/audio/wicked_world.mp3");

  return [{
    type: "AUDIO",
    content: <VoiceMessage audioSource={audioSource}/>,
    isLast: true
  }]
};

const buildDietResponse = () => {
  const isLocal = window.location.hostname === "localhost";
  const responses = [
    "/local/DY/01_I_CANT_BELIEVE_ITS_NOT_YEEZUS.mp3",
    "/local/DY/02_BLOODBATH.mp3",
    "/local/DY/03_COWGIRL.mp3",
    "/local/DY/04_ONE_I_LOVE.mp3",
    "/local/DY/05_UMAMI.mp3",
    "/local/DY/06_24_INTERLUDE.mp3",
    "/local/DY/07_I_THOUGHT_ABOUT_EATING_YOU.mp3",
    "/local/DY/08_I_FEEL_LIKE_SHIT.mp3",
    "/local/DY/09_NEVER_SEE_MEAT_AGAIN.mp3",
    "/local/DY/10_BONELESS.mp3",
    "/local/DY/11_EQUINOX.mp3",
    "/local/DY/12_SKINLESS.mp3",
  ];

  const audioSource = process.env.PUBLIC_URL + (isLocal ? responses[MathUtils.randInt(0, responses.length - 1)] : "/audio/wicked_world.mp3");

  return [{
    type: "AUDIO",
    content: <VoiceMessage audioSource={audioSource}/>,
    isLast: true
  }]
};

const buildGKTFResponse = () => {
  const isLocal = window.location.hostname === "localhost";
  const responses = [
    "/local/GKTF/01_GET_MUCH_HIGHER.mp3",
    "/local/GKTF/02_GOOD_KID_TWISTED_FANTASY.mp3",
    "/local/GKTF/03_SACRIFICE_YA_LIFE.mp3",
    "/local/GKTF/04_THE_MOON_SKIT_1.mp3",
    "/local/GKTF/05_MAAD_WORLD.mp3",
    "/local/GKTF/06_MONEY_POWER.mp3",
    "/local/GKTF/07_DEAD_POETS.mp3",
    "/local/GKTF/08_THE_MOON_SKIT_2.mp3",
    "/local/GKTF/09_SING_ABOUT_YE.mp3",
    "/local/GKTF/10_RUNAWAY_BLACK_HIPPY_FREESTYLE.mp3",
    "/local/GKTF/11_DEVIL_IN_THE_BACKSEAT.mp3",
  ];

  const audioSource = process.env.PUBLIC_URL + (isLocal ? responses[MathUtils.randInt(0, responses.length - 1)] : "/audio/wicked_world.mp3");

  return [{
    type: "AUDIO",
    content: <VoiceMessage audioSource={audioSource}/>,
    isLast: true
  }]
};

const buildImageResponse = () => {
  const responses = [
    "https://imgix.bustle.com/uploads/image/2021/2/22/4ddfcd7f-a90f-473d-97aa-8638f01aa3d0-gktf-poster.png",
    "https://i1.sndcdn.com/artworks-09dbQT5Tz9sClxMK-k19BcQ-t240x240.jpg",
    "https://imgix.bustle.com/uploads/image/2021/2/22/296aa9ef-fb31-4172-a762-52ff086ba590-gktf-final-final-cover-2.png",
    "https://i1.sndcdn.com/artworks-IKICxBxNJF1FKnu8-A9ddhg-t500x500.jpg",
    "https://images.genius.com/56de7fbfe3b0ef89e3dd66b54ccfccb1.500x500x1.jpg"
  ];

  return [{
    type: "IMAGE",
    content: responses[MathUtils.randInt(0, responses.length -1)],
    isLast: true,
  }]
};

const buildCanvasResponse = () => {
  return [{
    type: "CANVAS",
    content: <PhoneCanvas />,
    isLast: true,
  }]
};