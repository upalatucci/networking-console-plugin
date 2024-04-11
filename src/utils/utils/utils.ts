import { adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';

import { ALL_NAMESPACES_KEY, DEFAULT_NAMESPACE } from '@utils/constants';

export const networkConsole = console;

export const isEmpty = (obj) =>
  [Array, Object].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;

export const generateName = (prefix: string): string => {
  return `${prefix}-${uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: '-',
  })}`;
};

export const getValidNamespace = (activeNamespace: string) =>
  activeNamespace === ALL_NAMESPACES_KEY ? DEFAULT_NAMESPACE : activeNamespace;
