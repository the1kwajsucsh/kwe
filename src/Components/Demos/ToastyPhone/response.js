import {MathUtils} from "three";
import VoiceMessage from "./VoiceMessage";
import React from "react";

export const determineResponse = (responseType) => {
  switch(responseType) {
    case "GREETING":
      return buildGreetingResponse();
    case "AUDIO":
      return buildAudioResponse();
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