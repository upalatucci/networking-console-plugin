import React, { FC } from 'react';
import { Controller } from 'react-hook-form';

import { Checkbox, FormGroup, TextInput } from '@patternfly/react-core';
import PopoverHelpIcon from '@utils/components/PopoverHelpIcon/PopoverHelpIcon';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { NetworkTypeKeys } from '@views/nads/form/utils/types';

import { ParametersComponentProps } from '../../utils/types';

const BridgeParameters: FC<ParametersComponentProps> = ({ control, register }) => {
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
        control={control}
        defaultValue={true as never}
        name={`${NetworkTypeKeys.cnvBridgeNetworkType}.macspoofchk`}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            id={`${NetworkTypeKeys.cnvBridgeNetworkType}.macspoofchk`}
            isChecked={value}
            label={t('MAC spoof check')}
            onChange={onChange}
          />
        )}
      />
    </>
  );
};

export default BridgeParameters;
