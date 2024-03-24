import { FC } from 'react';

import { NetworkTypeKeys, NetworkTypeKeysType } from '@views/nads/form/utils/types';

import BridgeParameters from '../components/BridgeParameters/BridgeParameters';
import SecondaryLocalnetParameters from '../components/OVNK8sSecondaryLocalnetParameters/OVNK8sSecondaryLocalnetParameters';
import SriovParameters from '../components/SriovParameters/SriovParameters';

import { ParametersComponentProps } from './types';

export const networkTypeComponentMapper: Record<
  NetworkTypeKeysType,
  FC<ParametersComponentProps>
> = {
  [NetworkTypeKeys.cnvBridgeNetworkType]: BridgeParameters,
  [NetworkTypeKeys.ovnKubernetesNetworkType]: null,
  [NetworkTypeKeys.ovnKubernetesSecondaryLocalnet]: SecondaryLocalnetParameters,
  [NetworkTypeKeys.sriovNetworkType]: SriovParameters,
};
