import {cleanInput} from "./cleanInput";
import {getResponseType} from "./responseType";
import {determineResponse} from "./response";

export const parseInput = (input) => {

  const cleanedInput = cleanInput(input);
  const responseType = getResponseType(cleanedInput);
  return determineResponse(responseType);
};