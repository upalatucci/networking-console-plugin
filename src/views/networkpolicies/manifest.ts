import { EncodedExtension } from '@openshift/dynamic-plugin-sdk-webpack';
import {
  ResourceDetailsPage,
  ResourceListPage,
  ResourceNSNavItem,
  RoutePage,
  YAMLTemplate,
} from '@openshift-console/dynamic-plugin-sdk';
import { ConsolePluginBuildMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack/lib/build-types';

const NetworkPolicyExtensionModel = {
  group: 'networking.k8s.io',
  kind: 'NetworkPolicy',
  version: 'v1',
};

const MultiNetworkPolicyExtensionModel = {
  group: 'k8s.cni.cncf.io',
  kind: 'MultiNetworkPolicy',
  version: 'v1beta1',
};

export const NetworkPoliciesExtensions: EncodedExtension[] = [
  {
    properties: {
      component: { $codeRef: 'NetworkPolicyPage' },
      model: NetworkPolicyExtensionModel,
    },
    type: 'console.page/resource/list',
  } as EncodedExtension<ResourceListPage>,
  {
    properties: {
      component: { $codeRef: 'NetworkPolicyPage' },
      model: MultiNetworkPolicyExtensionModel,
    },
    type: 'console.page/resource/list',
  } as EncodedExtension<ResourceListPage>,
  {
    properties: {
      component: {
        $codeRef: 'NetworkPolicyPage',
      },
      exact: true,
      path: [
        `/k8s/ns/:ns/${NetworkPolicyExtensionModel.group}~${NetworkPolicyExtensionModel.version}~${NetworkPolicyExtensionModel.kind}/enable-multi`,
        `/k8s/all-namespaces/${NetworkPolicyExtensionModel.group}~${NetworkPolicyExtensionModel.version}~${NetworkPolicyExtensionModel.kind}/enable-multi`,
      ],
      perspective: 'admin',
    },
    type: 'console.page/route',
  } as EncodedExtension<RoutePage>,
  {
    properties: {
      dataAttributes: {
        'data-quickstart-id': 'qs-nav-np',
        'data-test-id': 'np-nav-item',
      },
      id: 'networkPolicies',
      model: NetworkPolicyExtensionModel,
      name: 'NetworkPolicies',
      section: 'networking',
    },
    type: 'console.navigation/resource-ns',
  } as EncodedExtension<ResourceNSNavItem>,
  {
    properties: {
      component: {
        $codeRef: 'NetworkPolicyForm',
      },
      exact: true,
      path: [
        `/k8s/ns/:ns/${NetworkPolicyExtensionModel.group}~${NetworkPolicyExtensionModel.version}~${NetworkPolicyExtensionModel.kind}/~new/form`,
        `/k8s/ns/:ns/${MultiNetworkPolicyExtensionModel.group}~${MultiNetworkPolicyExtensionModel.version}~${MultiNetworkPolicyExtensionModel.kind}/~new/form`,
      ],
      perspective: 'admin',
    },
    type: 'console.page/route',
  } as EncodedExtension<RoutePage>,
  {
    properties: {
      component: { $codeRef: 'NetworkPolicyDetailsPage' },
      model: NetworkPolicyExtensionModel,
    },
    type: 'console.page/resource/details',
  } as EncodedExtension<ResourceDetailsPage>,
  {
    properties: {
      component: { $codeRef: 'NetworkPolicyDetailsPage' },
      model: MultiNetworkPolicyExtensionModel,
    },
    type: 'console.page/resource/details',
  } as EncodedExtension<ResourceDetailsPage>,
  {
    properties: {
      model: NetworkPolicyExtensionModel,
      name: 'default',
      template: {
        $codeRef: 'yamlTemplates.NetworkPolicyYAMLTemplates',
      },
    },
    type: 'console.yaml-template',
  } as EncodedExtension<YAMLTemplate>,
];

export const NetworkPoliciesExposedModules: ConsolePluginBuildMetadata['exposedModules'] = {
  NetworkPolicyDetailsPage: './views/networkpolicies/details/NetworkPolicyDetailsPage.tsx',
  NetworkPolicyForm: './views/networkpolicies/new/NetworkPolicyForm.tsx',
  NetworkPolicyPage: './views/networkpolicies/list/NetworkPolicyPage.tsx',
};
