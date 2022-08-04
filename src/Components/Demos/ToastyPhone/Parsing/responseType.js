export const getResponseType = (input) => {

  if (isGreeting(input)) {
    return "GREETING";
  } else if (isThanks(input)) {
    return "THANK";
  } else if (isAudio(input)) {
    return "AUDIO";
  } else if (is2049(input)) {
    return "2049";
  } else if (isDietYeezus(input)) {
    return "DIET";
  } else if (isGKTF(input)) {
    return "GKTF";
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

const isThanks = (input) => {
  return input.includes(" thank you ")
    || input.includes(" thank ")
    || input.includes(" thanks ")
};

const is2049 = (input) => {
  return input.includes(" 2049 ")
  || input.includes(" kanye2049 ")
  || input.includes(" OG ")
  || input.includes(" throwback ")
    || input.includes(" throwbacks ")
};

const isDietYeezus = (input) => {
  return input.includes(" diet ")
  || input.includes(" yeezus ")
  || input.includes(" dietyeezus ")
};

const isGKTF = (input) => {
  return input.includes(" gktf ")
  || input.includes(" good kid ")
  || input.includes(" twisted fantasy ")
  || input.includes (" kendrick ")
  || input.includes(" lamar ")
};

const isAudio = (input) => {
  return input.includes(" track ")
    || input.includes(" tracks ")
    || input.includes(" audio ")
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
    || input.includes(" dope shit ")
    || input.includes(" 3d ")
    || input.includes(" future ")
    || input.includes(" futuristic ")
    || input.includes(" demo ")
};