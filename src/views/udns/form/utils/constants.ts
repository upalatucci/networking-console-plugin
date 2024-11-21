import { UserDefinedNetworkModel } from '@utils/models';
import { UserDefinedNetworkKind, UserDefinedNetworkRole } from '@utils/resources/udns/types';
import { generateName } from '@utils/utils';

export const LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY =
  'console.createUserDefinedNetwork.editor.lastView';

export const generateDefaultUDN = (): UserDefinedNetworkKind => ({
  apiVersion: `${UserDefinedNetworkModel.apiGroup}/${UserDefinedNetworkModel.apiVersion}`,
  kind: UserDefinedNetworkModel.kind,
  metadata: {
    name: generateName('udn'),
  },
  spec: {
    layer2: {
      role: UserDefinedNetworkRole.Primary,
      subnets: [''],
    },
    layer3: {
      role: UserDefinedNetworkRole.Primary,
      subnets: [{ cidr: '' }],
    },
    topology: 'Layer2',
  },
});
