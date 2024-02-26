export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

export const isEmpty = (obj) =>
  [Array, Object].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;
