import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

const getValueByPath = (obj: K8sResourceCommon, path: string) => {
  const pathArray = path?.split('.');
  return pathArray?.reduce((acc, field) => acc?.[field], obj);
};

export const sortCommonColumnsByPath = (path: string, direction: string) => (a, b) => {
  const { first, second } = direction === 'asc' ? { first: a, second: b } : { first: b, second: a };
  return getValueByPath(first, path)
    ?.toString()
    ?.localeCompare(getValueByPath(second, path)?.toString(), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
};
