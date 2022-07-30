export const getResponseType = (input) => {

  if (isGreeting(input)) {
    return "GREETING";
  } else if (isAudio(input)) {
    return "AUDIO";
  } else if (isImage(input)) {
    return "IMAGE";
  } else if (isPhoneCanvas(input)) {
    return "CANVAS"
  }

  return undefined;
};

const isGreeting = (input) => {
  return input.includes(" hi ")
    || input.includes(" hello ")
    || input.includes(" hey ")
    || input.includes(" yo ")
    || input.includes(" whattup ")
};

const isAudio = (input) => {
  return input.includes(" track ")
    || input.includes(" tracks ")
    || input.includes(" audio ")
    || input.includes(" dope ")
    || input.includes(" song ")
    || input.includes(" songs ")
    || input.includes(" music ")
};

const isImage = (input) => {
  return input.includes(" picture ")
    || input.includes(" pictures ")
    || input.includes(" pic ")
    || input.includes(" pics ")
    || input.includes(" cover ")
    || input.includes(" covers ")
    || input.includes(" image ")
    || input.includes(" images ")
    || input.includes(" img ")
    || input.includes(" imgs ")
};

const isPhoneCanvas = (input) => {
  return input.includes(" canvas ")
};