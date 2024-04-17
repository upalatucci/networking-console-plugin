import { RouteModel } from '@kubevirt-ui/kubevirt-api/console';
import { RouteKind } from '@utils/types';
import { generateName } from '@utils/utils';

export const generateDefaultRoute = (namespace: string): RouteKind => ({
  apiVersion: `${RouteModel.apiGroup}/${RouteModel.apiVersion}`,
  kind: RouteModel.kind,
  metadata: {
    name: generateName('route'),
    namespace,
  },
  spec: {
    path: '/',
    tls: null,
    to: {
      kind: 'Service',
      name: '',
    },
  },
});
