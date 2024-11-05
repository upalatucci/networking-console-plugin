import { UserDefinedNetworkLayer2, UserDefinedNetworkLayer3 } from '@utils/resources/udns/types';

export enum TopologyKeys {
  Layer2 = 'Layer2',
  Layer3 = 'Layer3',
}

export type UserDefinedNetworkFormInput = {
  [TopologyKeys.Layer2]?: UserDefinedNetworkLayer2;
  [TopologyKeys.Layer3]?: UserDefinedNetworkLayer3;
  description?: string;
  name: string;
  topology: string;
};
