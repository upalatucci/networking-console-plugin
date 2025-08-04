import React, { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  Form,
  FormGroup,
  NumberInput,
  PageSection,
  TextInput,
  Title,
} from '@patternfly/react-core';
import PopoverHelpIcon from '@utils/components/PopoverHelpIcon/PopoverHelpIcon';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

import { VMNetworkForm } from '../constants';

import BridgeMappingPopover from './BridgeMappingPopover';

const NetworkDefinition: FC = () => {
  const { t } = useNetworkingTranslation();
  const { control, register } = useFormContext<VMNetworkForm>();

  return (
    <PageSection>
      <Form>
        <Title headingLevel="h2">{t('Network definition')}</Title>
        <p>{t('This section is not editable once the network is created.')}</p>

        <FormGroup fieldId="name" isRequired label={t('Name')}>
          <TextInput {...register('network.metadata.name', { required: true })} />
        </FormGroup>
        <FormGroup fieldId="description" label={t('Description')}>
          <TextInput
            {...register('network.metadata.annotations.description', { required: false })}
          />
        </FormGroup>
        <FormGroup
          fieldId="bridge-mapping"
          isRequired
          label={t('Bridge mapping')}
          labelHelp={<PopoverHelpIcon bodyContent={<BridgeMappingPopover />} />}
        >
          <TextInput
            {...register('network.spec.network.localnet.physicalNetworkName', { required: true })}
          />
        </FormGroup>
        <FormGroup fieldId="mtu" isRequired label={t('MTU')}>
          <Controller
            control={control}
            name="network.spec.network.localnet.mtu"
            render={({ field: { onChange, value } }) => (
              <NumberInput
                min={0}
                onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
                onMinus={() => onChange(value - 1)}
                onPlus={() => onChange(value + 1)}
                value={value}
              />
            )}
          />
        </FormGroup>
      </Form>
    </PageSection>
  );
};

export default NetworkDefinition;
