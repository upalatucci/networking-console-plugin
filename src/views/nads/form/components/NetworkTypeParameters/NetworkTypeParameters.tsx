import React, { FC } from 'react';
import { isEmpty } from '@utils/utils';

import { ParametersComponentProps } from './utils/types';
import { networkTypeComponentMapper } from './utils/constants';

type NetworkTypeParametersProps = {
  networkType: string;
} & ParametersComponentProps;

const NetworkTypeParameters: FC<NetworkTypeParametersProps> = ({
  networkType,
  register,
  control,
}) => {
  const ParametersComponent = networkTypeComponentMapper[networkType];

  if (isEmpty(networkType) || isEmpty(ParametersComponent)) return null;

  return <ParametersComponent register={register} control={control} />;
};

export default NetworkTypeParameters;
