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

export const get = (obj: unknown, path: string | string[], defaultValue = undefined) => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res: { [x: string]: any }, key: number | string) => {
        return res !== null && res !== undefined ? res[key] : res;
      }, obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

export const isString = (val: unknown) => val !== null && typeof val === 'string';
