import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';

import { ALL_NAMESPACES_KEY, DEFAULT_NAMESPACE } from '@utils/constants';

export const networkConsole = console;

export const isEmpty = (obj) =>
  [Array, Object].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;

export const isEqualObject = (object, otherObject) => {
  if (object === otherObject) {
    return true;
  }

  if (object === null || otherObject === null) {
    return false;
  }

  if (object?.constructor !== otherObject?.constructor) {
    return false;
  }

  if (typeof object !== 'object') {
    return false;
  }

  const objectKeys = Object.keys(object);
  const otherObjectKeys = Object.keys(otherObject);

  if (objectKeys.length !== otherObjectKeys.length) {
    return false;
  }

  for (const key of objectKeys) {
    if (!otherObjectKeys.includes(key) || !isEqualObject(object[key], otherObject[key])) {
      return false;
    }
  }

  return true;
};

export const generateName = (prefix: string): string => {
  return `${prefix}-${uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: '-',
  })}`;
};

export const getValidNamespace = (activeNamespace: string) =>
  activeNamespace === ALL_NAMESPACES_KEY ? DEFAULT_NAMESPACE : activeNamespace;
