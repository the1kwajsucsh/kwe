import {MathUtils} from "three";

export const determineResponse = (responseType) => {
  switch(responseType) {
    case "GREETING":
      return buildGreetingResponse();
    default:
      return undefined;
  }
};

const buildGreetingResponse = () => {
  const responses = ["Hello", "Hey", "Ayoooooo", "Whattup", "????"];
  return [{
    content: responses[MathUtils.randInt(0, responses.length - 1)],
    isLast: true,
  }];
};

