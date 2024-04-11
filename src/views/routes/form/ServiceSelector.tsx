import React, { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { IoK8sApiCoreV1Service } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { ResourceIcon, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import {
  Alert,
  DropdownItem,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import Loading from '@utils/components/Loading/Loading';
import Select from '@utils/components/Select/Select';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { getName } from '@utils/resources/shared';

import AlternateService from './AlternateServicesSection';
import { SERVICE_FIELD_ID, ServiceGroupVersionKind } from './constants';
import TargetPort from './Targetport';

type ServiceSelectorProps = {
  namespace: string;
};

const ServiceSelector: FC<ServiceSelectorProps> = ({ namespace }) => {
  const { control, setValue, watch } = useFormContext();

  const selectedServiceName = watch('spec.to.name');

  const { t } = useNetworkingTranslation();

  const [services, loaded, error] = useK8sWatchResource<IoK8sApiCoreV1Service[]>({
    groupVersionKind: ServiceGroupVersionKind,
    isList: true,
    namespace,
  });

  const selectedService = (services || []).find(
    (service) => getName(service) === selectedServiceName,
  );

  if (!loaded) return <Loading />;

  if (error) return <Alert title={t('Error')}></Alert>;

  return (
    <>
      <Controller
        control={control}
        name="spec.to.name"
        render={({ field: { onChange, value } }) => (
          <FormGroup fieldId={SERVICE_FIELD_ID} isRequired label={t('Service')}>
            <Select
              id={SERVICE_FIELD_ID}
              selected={value}
              toggleContent={
                value ? (
                  <>
                    <ResourceIcon groupVersionKind={ServiceGroupVersionKind} /> {value}
                  </>
                ) : (
                  t('Select a Service')
                )
              }
            >
              <>
                {(services || []).map((service) => (
                  <DropdownItem
                    key={getName(service)}
                    onClick={() => {
                      onChange(getName(service));
                      setValue('spec.port.targetPort', '');
                    }}
                    value={getName(service)}
                  >
                    <ResourceIcon groupVersionKind={ServiceGroupVersionKind} /> {getName(service)}
                  </DropdownItem>
                ))}
              </>
            </Select>

            <FormHelperText>
              <HelperText>
                <HelperTextItem>{t('Service to route to.')}</HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        )}
        rules={{ required: true }}
      />
      {selectedService && (
        <AlternateService
          services={services?.filter((service) => getName(service) !== getName(selectedService))}
        />
      )}
      <TargetPort service={selectedService} />
    </>
  );
};

export default ServiceSelector;
