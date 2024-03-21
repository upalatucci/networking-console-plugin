import { Checkbox, FormGroup, TextInput } from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import React, { FC } from 'react';
import { ParametersComponentProps } from '../../utils/types';

import { Controller } from 'react-hook-form';
import PopoverHelpIcon from '@utils/components/PopoverHelpIcon/PopoverHelpIcon';
import { NetworkTypeKeys } from '@views/nads/form/utils/types';

const BridgeParameters: FC<ParametersComponentProps> = ({ register, control }) => {
  const { t } = useNetworkingTranslation();
  return (
    <>
      <FormGroup isRequired label={t('Bridge name')}>
        <TextInput
          {...register(`${NetworkTypeKeys.cnvBridgeNetworkType}.bridge`, { required: true })}
        />
      </FormGroup>
      <FormGroup
        label={t('VLAN tag number')}
        labelIcon={<PopoverHelpIcon bodyContent={t('Example: 100')} />}
      >
        <TextInput {...register(`${NetworkTypeKeys.cnvBridgeNetworkType}.vlanTagNum`)} />
      </FormGroup>
      <Controller
        name={`${NetworkTypeKeys.cnvBridgeNetworkType}.macspoofchk`}
        control={control}
        render={() => (
          <Checkbox
            defaultChecked
            id={`${NetworkTypeKeys.cnvBridgeNetworkType}.macspoofchk`}
            label={t('MAC spoof check')}
          />
        )}
      />
    </>
  );
};

export default BridgeParameters;
