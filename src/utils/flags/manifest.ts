import { EncodedExtension } from '@openshift/dynamic-plugin-sdk-webpack';
import { FeatureFlag } from '@openshift-console/dynamic-plugin-sdk';

export const FlagsExtensions: EncodedExtension[] = [
  {
    properties: {
      handler: { $codeRef: 'networkingFlags.enableNetworkingDynamicFlag' },
    },
    type: 'console.flag',
  } as EncodedExtension<FeatureFlag>,
];

export const FlagsExposedModules = {
  networkingFlags: './utils/flags',
};
