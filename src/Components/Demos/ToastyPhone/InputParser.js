export const parseInput = (input) => {

  let response = "Display response";

  const message = {
    content: response,
    isLast: true,
  };

  const shouldResponse = Math.round(Math.random());

  return (shouldResponse ? message : undefined);
};