import { EncodedExtension } from '@openshift/dynamic-plugin-sdk-webpack';
import { FeatureFlag } from '@openshift-console/dynamic-plugin-sdk';

export const FlagsExtensions: EncodedExtension[] = [
  {
    type: 'console.flag',
    properties: {
      handler: { $codeRef: 'networkingFlags.enableNetworkingDynamicFlag' },
    },
  } as EncodedExtension<FeatureFlag>,
];

export const FlagsExposedModules = {
  networkingFlags: './utils/flags',
};
