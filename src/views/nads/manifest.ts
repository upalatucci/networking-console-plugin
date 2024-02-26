import { EncodedExtension } from '@openshift/dynamic-plugin-sdk-webpack';
import { ConsolePluginBuildMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack/lib/build-types';
import {
  ResourceDetailsPage,
  ResourceListPage,
  ResourceNSNavItem,
  RoutePage,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  FLAG_KUBEVIRT_DEF,
  FLAG_NET_ATTACH_DEF,
} from '../../utils/flags/consts';

const NetworkAttachmentDefinitionExtensionModel = {
  version: 'v1',
  group: 'k8s.cni.cncf.io',
  kind: 'NetworkAttachmentDefinition',
};

export const NADsExtensions: EncodedExtension[] = [
  {
    type: 'console.page/resource/details',
    properties: {
      model: NetworkAttachmentDefinitionExtensionModel,
      component: { $codeRef: 'NetworkAttachmentDefinitionDetail' },
    },
  } as EncodedExtension<ResourceDetailsPage>,
  {
    properties: {
      component: { $codeRef: 'NetworkAttachmentDefinitionList' },
      model: NetworkAttachmentDefinitionExtensionModel,
    },
    type: 'console.page/resource/list',
  } as EncodedExtension<ResourceListPage>,
  {
    type: 'console.navigation/resource-ns',
    properties: {
      id: 'networkattachmentdefinitions',
      section: 'networking',
      name: 'NetworkAttachmentDefinitions',
      model: NetworkAttachmentDefinitionExtensionModel,
      dataAttributes: {
        'data-quickstart-id': 'qs-nav-nads',
        'data-test-id': 'nads-nav-item',
      },
    },
    flags: {
      required: [FLAG_NET_ATTACH_DEF, FLAG_KUBEVIRT_DEF],
    },
  } as EncodedExtension<ResourceNSNavItem>,

  {
    type: 'console.page/route',
    properties: {
      perspective: 'admin',
      exact: true,
      path: [
        `/k8s/ns/:ns/k8s.cni.cncf.io~v1~NetworkAttachmentDefinition/~new/test`,
      ],
      component: {
        $codeRef: 'NetworkAttachmentDefinitionList',
      },
      flags: {
        required: [FLAG_NET_ATTACH_DEF],
      },
    },
  } as EncodedExtension<RoutePage>,
];

export const NADsExposedModules: ConsolePluginBuildMetadata['exposedModules'] =
  {
    NetworkAttachmentDefinitionList:
      './views/nads/list/NetworkAttachmentDefinitionList.tsx',
    NetworkAttachmentDefinitionDetail:
      './views/nads/detail/NetworkAttachmentDefinitionDetail.tsx',
  };
