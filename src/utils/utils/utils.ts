export const networkConsole = console;

export const isEmpty = (obj) =>
  [Array, Object].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;
