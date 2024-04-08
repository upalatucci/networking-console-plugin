import React, { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { IoK8sApiCoreV1Service } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { Button } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { getName } from '@utils/resources/shared';
import { RouteKind } from '@utils/types';

import AlternateService from './AlternateService';

type AlternateServicesSectionProps = {
  services: IoK8sApiCoreV1Service[];
};

const AlternateServicesSection: FC<AlternateServicesSectionProps> = ({ services }) => {
  const { t } = useNetworkingTranslation();

  const { control, watch } = useFormContext<RouteKind>();

  const { append, fields } = useFieldArray({ control, name: 'spec.alternateBackends' });

  const selectedServiceNames = watch('spec.alternateBackends')?.map((field) => field.name) || [];
  const filteredServices = (services || []).filter(
    (service) => !selectedServiceNames.includes(getName(service)),
  );

  return (
    <>
      {fields.map((field, index) => (
        <AlternateService
          field={field}
          filteredServices={filteredServices}
          index={index}
          key={field.id}
        />
      ))}

      {filteredServices?.length !== 0 && (
        <Button
          className="pf-m-link--align-left co-create-route__add-service-btn"
          isInline
          onClick={() => append({ kind: 'Service', name: '', weight: 100 })}
          type="button"
          variant="link"
        >
          <PlusCircleIcon className="co-icon-space-r" />
          {t('Add alternate Service')}
        </Button>
      )}
    </>
  );
};

export default AlternateServicesSection;
