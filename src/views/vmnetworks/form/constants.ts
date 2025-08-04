import { ClusterUserDefinedNetworkModel } from '@utils/models';
import { LOCALNET_TOPOLOGY } from '@utils/resources/udns/constants';
import { ClusterUserDefinedNetworkKind, UserDefinedNetworkRole } from '@utils/resources/udns/types';

export const defaultVMNetwork: ClusterUserDefinedNetworkKind = {
  apiVersion: `${ClusterUserDefinedNetworkModel.apiGroup}/${ClusterUserDefinedNetworkModel.apiVersion}`,
  kind: ClusterUserDefinedNetworkModel.kind,
  metadata: {
    annotations: {},
    name: '',
  },
  spec: {
    namespaceSelector: {},
    network: {
      localnet: {
        ipam: {
          mode: 'Disabled',
        },
        mtu: 1500,
        physicalNetworkName: '',

        role: UserDefinedNetworkRole.Secondary,
      },
      topology: LOCALNET_TOPOLOGY,
    },
  },
};

export type VMNetworkForm = {
  matchLabelCheck: boolean;
  network: ClusterUserDefinedNetworkKind;
  projectList: boolean;
};

export const defaultFormValue: VMNetworkForm = {
  matchLabelCheck: false,
  network: defaultVMNetwork,
  projectList: true,
};
