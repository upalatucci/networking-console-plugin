import React, { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { IoK8sApiCoreV1Service } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import {
  DropdownItem,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import Select from '@utils/components/Select/Select';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

type TargetPortProps = {
  service: IoK8sApiCoreV1Service;
};

const TargetPort: FC<TargetPortProps> = ({ service }) => {
  const { t } = useNetworkingTranslation();

  const { control, watch } = useFormContext();
  const selectedTargetPort = watch('spec.port.targetPort');

  const ports = service?.spec?.ports;

  const selectedServicePort = ports?.find(
    (port) => port.name === selectedTargetPort || port.targetPort === selectedTargetPort,
  );

  if (!service) return null;

  return (
    <Controller
      control={control}
      name="spec.port.targetPort"
      render={({ field: { onChange, value } }) => (
        <FormGroup fieldId="target-port" isRequired label={t('Target port')}>
          <Select
            id="target-port"
            selected={value}
            toggleContent={
              selectedServicePort === undefined ? (
                t('Select target port')
              ) : (
                <>
                  {selectedServicePort.port} &rarr; {selectedServicePort.targetPort} (
                  {selectedServicePort.protocol})
                </>
              )
            }
          >
            <>
              {(ports || []).map((port) => (
                <DropdownItem
                  key={port.name || port.targetPort}
                  onClick={() => {
                    onChange(port.name || port.targetPort);
                  }}
                  value={port.name || port.targetPort}
                >
                  {port.port} &rarr; {port.targetPort} ({port.protocol})
                </DropdownItem>
              ))}
            </>
          </Select>

          <FormHelperText>
            <HelperText>
              <HelperTextItem>{t('Target port for traffic')}</HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
      )}
      rules={{ required: true }}
    />
  );
};

export default TargetPort;
