import { EncodedExtension } from '@openshift/dynamic-plugin-sdk-webpack';
import { ConsolePluginBuildMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack/lib/build-types';
import { YAMLExposedModules, YAMLExtensions } from './src/templates/manifest';
import { NADsExposedModules, NADsExtensions } from './src/views/nads/manifest';
import {
  FlagsExposedModules,
  FlagsExtensions,
} from './src/utils/flags/manifest';

export const pluginMetadata: ConsolePluginBuildMetadata = {
  name: 'networking-console-plugin',
  version: '0.0.1',
  displayName: 'Networking console plugin',
  description: 'Plugin responsable for all the networking section ui code',
  exposedModules: {
    ...YAMLExposedModules,
    ...NADsExposedModules,
    ...FlagsExposedModules,
  },
  dependencies: {
    '@console/pluginAPI': '*',
  },
};

export const extensions: EncodedExtension[] = [
  ...YAMLExtensions,
  ...NADsExtensions,
  ...FlagsExtensions,
];
