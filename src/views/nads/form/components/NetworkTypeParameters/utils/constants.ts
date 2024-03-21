import { FC } from 'react';
import { ParametersComponentProps } from './types';
import SriovParameters from '../components/SriovParameters/SriovParameters';
import BridgeParameters from '../components/BridgeParameters/BridgeParameters';
import SecondaryLocalnetParameters from '../components/OVNK8sSecondaryLocalnetParameters/OVNK8sSecondaryLocalnetParameters';
import { NetworkTypeKeys } from '@views/nads/form/utils/types';

export const networkTypeComponentMapper: { [key: string]: FC<ParametersComponentProps> } = {
  [NetworkTypeKeys.cnvBridgeNetworkType]: BridgeParameters,
  [NetworkTypeKeys.ovnKubernetesSecondaryLocalnet]: SecondaryLocalnetParameters,
  [NetworkTypeKeys.sriovNetworkType]: SriovParameters,
};
