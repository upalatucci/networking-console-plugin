import { EncodedExtension } from '@openshift/dynamic-plugin-sdk-webpack';
import {
  DetailsItem,
  ResourceListPage,
  ResourceNSNavItem,
  RoutePage,
  YAMLTemplate,
} from '@openshift-console/dynamic-plugin-sdk';
import { ConsolePluginBuildMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack/lib/build-types';
import { SHARED_DEFAULT_PATH_NEW_RESOURCE_FORM } from '@utils/utils/paths';

import { FLAG_KUBEVIRT, FLAG_NET_ATTACH_DEF } from '../../utils/flags/consts';

const NetworkAttachmentDefinitionExtensionModel = {
  group: 'k8s.cni.cncf.io',
  kind: 'NetworkAttachmentDefinition',
  version: 'v1',
};

export const NADsExtensions: EncodedExtension[] = [
  {
    properties: {
      component: { $codeRef: 'NetworkAttachmentDefinitionList' },
      model: NetworkAttachmentDefinitionExtensionModel,
    },
    type: 'console.page/resource/list',
  } as EncodedExtension<ResourceListPage>,
  {
    flags: {
      required: [FLAG_NET_ATTACH_DEF, FLAG_KUBEVIRT],
    },
    properties: {
      dataAttributes: {
        'data-quickstart-id': 'qs-nav-nads',
        'data-test-id': 'nads-nav-item',
      },
      id: 'networkattachmentdefinitions',
      model: NetworkAttachmentDefinitionExtensionModel,
      name: 'NetworkAttachmentDefinitions',
      section: 'networking',
    },
    type: 'console.navigation/resource-ns',
  } as EncodedExtension<ResourceNSNavItem>,

  {
    properties: {
      component: {
        $codeRef: 'NetworkAttachmentDefinitionsForm',
      },
      exact: true,
      flags: {
        required: [FLAG_NET_ATTACH_DEF],
      },
      path: [
        `/k8s/ns/:ns/${NetworkAttachmentDefinitionExtensionModel.group}~${NetworkAttachmentDefinitionExtensionModel.version}~${NetworkAttachmentDefinitionExtensionModel.kind}/${SHARED_DEFAULT_PATH_NEW_RESOURCE_FORM}`,
      ],
      perspective: 'admin',
    },
    type: 'console.page/route',
  } as EncodedExtension<RoutePage>,
  {
    properties: {
      column: 'right',
      component: { $codeRef: 'NetworkAttachmentDefintionTypeDetails' },
      id: 'nad-type-detail-item',
      model: NetworkAttachmentDefinitionExtensionModel,
      path: 'spec.config.type',
      title: 'Type',
    },
    type: 'console.resource/details-item',
  } as EncodedExtension<DetailsItem>,

  {
    properties: {
      model: NetworkAttachmentDefinitionExtensionModel,
      name: 'default',
      template: {
        $codeRef: 'yamlTemplates.NetworkAttachmentDefinitionsYAMLTemplates',
      },
    },
    type: 'console.yaml-template',
  } as EncodedExtension<YAMLTemplate>,
];

export const NADsExposedModules: ConsolePluginBuildMetadata['exposedModules'] = {
  NetworkAttachmentDefinitionList: './views/nads/list/NetworkAttachmentDefinitionList.tsx',
  NetworkAttachmentDefinitionsForm: './views/nads/form/NetworkAttachmentDefinitionForm.tsx',
  NetworkAttachmentDefintionTypeDetails: './views/nads/details/tabs/details/NADTypeDetails.tsx',
};
