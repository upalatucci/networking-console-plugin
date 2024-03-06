import { EncodedExtension } from '@openshift/dynamic-plugin-sdk-webpack';
import { ConsolePluginBuildMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack/lib/build-types';
import {
  ResourceListPage,
  ResourceNSNavItem,
} from '@openshift-console/dynamic-plugin-sdk';
import { FLAG_KUBEVIRT, FLAG_NET_ATTACH_DEF } from '../../utils/flags/consts';

const NetworkPolicyExtensionModel = {
  version: 'v1',
  group: 'networking.k8s.io',
  kind: 'NetworkPolicy',
};

export const NetworkPoliciesExtensions: EncodedExtension[] = [
  {
    properties: {
      component: { $codeRef: 'NetworkPolicyList' },
      model: NetworkPolicyExtensionModel,
    },
    type: 'console.page/resource/list',
  } as EncodedExtension<ResourceListPage>,
  {
    type: 'console.navigation/resource-ns',
    properties: {
      id: 'networkPolicies',
      section: 'networking',
      name: 'NetworkPolicies',
      model: NetworkPolicyExtensionModel,
      dataAttributes: {
        'data-quickstart-id': 'qs-nav-nads',
        'data-test-id': 'nads-nav-item',
      },
    },
    flags: {
      required: [FLAG_NET_ATTACH_DEF, FLAG_KUBEVIRT],
    },
  } as EncodedExtension<ResourceNSNavItem>,
];

export const NetworkPoliciesExposedModules: ConsolePluginBuildMetadata['exposedModules'] =
  {
    NetworkPolicyList: './views/networkpolicies/list/NetworkPolicyList.tsx',
  };
