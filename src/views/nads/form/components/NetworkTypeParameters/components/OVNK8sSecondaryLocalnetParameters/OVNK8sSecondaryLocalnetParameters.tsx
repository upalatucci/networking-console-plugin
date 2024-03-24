import React, { FC } from 'react';

import { FormGroup, TextInput } from '@patternfly/react-core';
import PopoverHelpIcon from '@utils/components/PopoverHelpIcon/PopoverHelpIcon';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { NetworkTypeKeys } from '@views/nads/form/utils/types';

import { ParametersComponentProps } from '../../utils/types';

const OVNK8sSecondaryLocalnetParameters: FC<ParametersComponentProps> = ({ register }) => {
  const { t } = useNetworkingTranslation();
  return (
    <>
      <FormGroup
        isRequired
        label={t('Bridge mapping')}
        labelIcon={
          <PopoverHelpIcon
            bodyContent={t(
              'Physical network name. A bridge mapping must be configured on cluster nodes to map between physical network names and Open vSwitch bridges.',
            )}
          />
        }
      >
        <TextInput
          {...register(`${NetworkTypeKeys.ovnKubernetesSecondaryLocalnet}.bridgeMapping`, {
            required: true,
          })}
        />
      </FormGroup>
      <FormGroup label={t('MTU')}>
        <TextInput {...register(`${NetworkTypeKeys.ovnKubernetesSecondaryLocalnet}.mtu`)} />
      </FormGroup>
      <FormGroup label={t('VLAN')}>
        <TextInput {...register(`${NetworkTypeKeys.ovnKubernetesSecondaryLocalnet}.vlanID`)} />
      </FormGroup>
    </>
  );
};

export default OVNK8sSecondaryLocalnetParameters;
