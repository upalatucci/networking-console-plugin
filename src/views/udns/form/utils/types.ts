import { Selector } from '@openshift-console/dynamic-plugin-sdk';
import { LAYER2_TOPOLOGY, LAYER3_TOPOLOGY } from '@utils/resources/udns/constants';
import { UserDefinedNetworkLayer2, UserDefinedNetworkLayer3 } from '@utils/resources/udns/types';

export enum TopologyKeys {
  Layer2 = LAYER2_TOPOLOGY,
  Layer3 = LAYER3_TOPOLOGY,
}

export type UserDefinedNetworkFormInput = {
  [TopologyKeys.Layer2]?: UserDefinedNetworkLayer2;
  [TopologyKeys.Layer3]?: UserDefinedNetworkLayer3;
  apiVersion?: string;
  description?: string;
  kind?: string;
  name: string;
  namespaceSelector?: Selector;
  topology: string;
};
