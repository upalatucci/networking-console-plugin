import { EncodedExtension } from '@openshift/dynamic-plugin-sdk-webpack';
import {
  ResourceDetailsPage,
  ResourceListPage,
  ResourceNSNavItem,
  YAMLTemplate,
} from '@openshift-console/dynamic-plugin-sdk';
import { ConsolePluginBuildMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack/lib/build-types';

const RouteExtensionModel = {
  group: 'route.openshift.io',
  kind: 'Route',
  version: 'v1',
};

export const RoutesExtensions: EncodedExtension[] = [
  {
    properties: {
      component: { $codeRef: 'RoutesList' },
      model: RouteExtensionModel,
    },
    type: 'console.page/resource/list',
  } as EncodedExtension<ResourceListPage>,
  {
    properties: {
      dataAttributes: {
        'data-quickstart-id': 'qs-nav-nads',
        'data-test-id': 'nads-nav-item',
      },
      id: 'routes',
      model: RouteExtensionModel,
      name: 'Routes',
      section: 'networking',
    },
    type: 'console.navigation/resource-ns',
  } as EncodedExtension<ResourceNSNavItem>,
  {
    properties: {
      model: RouteExtensionModel,
      name: 'default',
      template: {
        $codeRef: 'yamlTemplates.RouteYAMLTemplates',
      },
    },
    type: 'console.yaml-template',
  } as EncodedExtension<YAMLTemplate>,
  {
    properties: {
      component: { $codeRef: 'RouteDetails' },
      model: RouteExtensionModel,
    },
    type: 'console.page/resource/details',
  } as EncodedExtension<ResourceDetailsPage>,
];

export const RoutesExposedModules: ConsolePluginBuildMetadata['exposedModules'] = {
  RouteDetails: './views/routes/details/RouteDetailsPage.tsx',
  RoutesList: './views/routes/list/RoutesList.tsx',
};
