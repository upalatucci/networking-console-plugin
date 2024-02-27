import {
  NetworkAttachmentDefinitionConfig,
  NetworkAttachmentDefinitionKind,
} from '../types';

export const getConfigAsJSON = (
  obj: NetworkAttachmentDefinitionKind,
): NetworkAttachmentDefinitionConfig => {
  try {
    return JSON.parse(obj?.spec?.config);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      'Unable to parse network attachment definition configuration',
    );
    return null;
  }
};

export const getType = (config: NetworkAttachmentDefinitionConfig): string => {
  return config?.type === undefined ? null : config.type;
};

export const getDescription = (
  netAttachDef: NetworkAttachmentDefinitionKind,
): string => netAttachDef?.metadata?.annotations?.description;
