export const getResponseType = (input) => {

  if (isGreeting(input)) {
    return "GREETING";
  } else if (isAudio(input)) {
    return "AUDIO";
  }

  return undefined;
};

const isGreeting = (input) => {
  return input.includes(" hi ") || input.includes(" hello ") || input.includes(" hey ") || input.includes(" yo ") || input.includes(" whattup ");
};

const isAudio = (input) => {
  return input.includes(" track ")
    || input.includes(" tracks ")
    || input.includes(" audio ")
    || input.includes(" dope ")
    || input.includes(" song ")
    || input.includes(" songs ")
    || input.includes(" send ");
};