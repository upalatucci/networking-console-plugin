import React, { FC } from 'react';

import { isEmpty } from '@utils/utils';

import { NetworkTypeKeysType } from '../../utils/types';

import { networkTypeComponentMapper } from './utils/constants';
import { ParametersComponentProps } from './utils/types';

type NetworkTypeParametersProps = {
  networkType: NetworkTypeKeysType;
} & ParametersComponentProps;

const NetworkTypeParameters: FC<NetworkTypeParametersProps> = ({
  control,
  networkType,
  register,
}) => {
  const ParametersComponent = networkTypeComponentMapper?.[networkType];

  if (isEmpty(networkType) || isEmpty(ParametersComponent)) return null;

  return <ParametersComponent control={control} register={register} />;
};

export default NetworkTypeParameters;
