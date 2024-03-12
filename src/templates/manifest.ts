import { EncodedExtension } from '@openshift/dynamic-plugin-sdk-webpack';
import type { YAMLTemplate } from '@openshift-console/dynamic-plugin-sdk';
import { ConsolePluginBuildMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack/lib/build-types';

const NetworkAttachmentDefinitionExtensionModel = {
  group: 'k8s.cni.cncf.io',
  kind: 'NetworkAttachmentDefinition',
  version: 'v1',
};

export const YAMLExtensions: EncodedExtension<YAMLTemplate>[] = [
  {
    properties: {
      model: NetworkAttachmentDefinitionExtensionModel,
      name: 'default',
      template: {
        $codeRef: 'yamlTemplates.NetworkAttachmentDefinitionsYAMLTemplates',
      },
    },
    type: 'console.yaml-template',
  },
];

export const YAMLExposedModules: ConsolePluginBuildMetadata['exposedModules'] = {
  yamlTemplates: './templates/index.ts',
};
