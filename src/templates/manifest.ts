import { EncodedExtension } from '@openshift/dynamic-plugin-sdk-webpack';
import { ConsolePluginBuildMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack/lib/build-types';

import type { YAMLTemplate } from '@openshift-console/dynamic-plugin-sdk';

const NetworkAttachmentDefinitionExtensionModel = {
  version: 'v1',
  group: 'k8s.cni.cncf.io',
  kind: 'NetworkAttachmentDefinition',
};

export const YAMLExtensions: EncodedExtension<YAMLTemplate>[] = [
  {
    type: 'console.yaml-template',
    properties: {
      name: 'default',
      model: NetworkAttachmentDefinitionExtensionModel,
      template: {
        $codeRef: 'yamlTemplates.NetworkAttachmentDefinitionsYAMLTemplates',
      },
    },
  },
];

export const YAMLExposedModules: ConsolePluginBuildMetadata['exposedModules'] =
  {
    yamlTemplates: './templates/index.ts',
  };
