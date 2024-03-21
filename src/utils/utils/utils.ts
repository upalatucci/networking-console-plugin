import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

export const networkConsole = console;

export const isEmpty = (obj) =>
  [Array, Object].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;

export const generateName = (prefix: string): string => {
  return `${prefix}-${uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: '-',
  })}`;
};
