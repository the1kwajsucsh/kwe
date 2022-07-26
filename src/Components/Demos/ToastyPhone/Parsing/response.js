import {MathUtils} from "three";
import VoiceMessage from "../Audio/VoiceMessage";
import React from "react";

export const determineResponse = (responseType) => {
  switch(responseType) {
    case "GREETING":
      return buildGreetingResponse();
    case "AUDIO":
      return buildAudioResponse();
    case "IMAGE":
      return buildImageResponse();
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

const buildAudioResponse = () => {
  return [{
    type: "AUDIO",
    content: <VoiceMessage/>,
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