import React, { FC, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom-v5-compat';

import { RouteModel } from '@kubevirt-ui/kubevirt-api/console';
import { k8sCreate, useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';
import {
  Checkbox,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  PageSection,
  PageSectionVariants,
  Text,
  TextInput,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { RouteKind } from '@utils/types';
import { getValidNamespace, resourcePathFromModel } from '@utils/utils';

import { HOST_FIELD_ID, NAME_FIELD_ID, PATH_FIELD_ID, SECURITY_FIELD_ID } from './constants';
import RouteFormActions from './RouteFormActions';
import ServiceSelector from './ServiceSelector';
import TLSTermination from './TLSTermination';
import { generateDefaultRoute } from './utils';

const RouteForm: FC = () => {
  const { t } = useNetworkingTranslation();
  const navigate = useNavigate();
  const [apiError, setError] = useState<Error>(null);
  const [activeNamespace] = useActiveNamespace();
  const namespace = getValidNamespace(activeNamespace);

  const methods = useForm<RouteKind>({
    defaultValues: generateDefaultRoute(namespace),
  });

  const { control, handleSubmit, register, watch } = methods;

  const tls = watch('spec.tls');

  const isSecured = Boolean(tls);

  const onSubmit = (data: RouteKind) => {
    k8sCreate({ data, model: RouteModel })
      .then(() => {
        navigate(resourcePathFromModel(RouteModel, data?.metadata?.name, namespace));
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Title headingLevel="h2">{t('Create {{label}}', { label: RouteModel.label })}</Title>
      <Text component={TextVariants.p}>
        {t('Routing is a way to make your application publicly visible')}
      </Text>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup fieldId={NAME_FIELD_ID} isRequired label={t('Name')}>
            <TextInput id={NAME_FIELD_ID} {...register('metadata.name', { required: true })} />

            <FormHelperText>
              <HelperText>
                <HelperTextItem>
                  {t('A unique name for the Route within the project')}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
          <FormGroup fieldId={HOST_FIELD_ID} isRequired label={t('Hostname')}>
            <TextInput id={HOST_FIELD_ID} {...register('spec.host', { required: true })} />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>
                  {t('Public hostname for the Route. If not specified, a hostname is generated.')}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
          <FormGroup fieldId={PATH_FIELD_ID} isRequired label={t('Path')}>
            <TextInput id={PATH_FIELD_ID} {...register('spec.path', { required: true })} />
            <FormHelperText>
              <HelperText>
                <HelperTextItem>
                  {t('Path that the router watches to route traffic to the service.')}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
          <ServiceSelector namespace={namespace} />

          <FormGroup fieldId={SECURITY_FIELD_ID} label={t('Security')}>
            <Controller
              control={control}
              defaultValue={true as never}
              name={'spec.tls'}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  id={SECURITY_FIELD_ID}
                  isChecked={value !== null && value !== undefined}
                  label={t('Secure Route')}
                  onChange={(event, checked) => onChange(checked ? {} : null)}
                />
              )}
            />

            <FormHelperText>
              <HelperText>
                <HelperTextItem>
                  {t(
                    'Routes can be secured using several TLS termination types for serving certificates.',
                  )}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>

          {isSecured && <TLSTermination />}

          <RouteFormActions apiError={apiError} />
        </Form>
      </FormProvider>
    </PageSection>
  );
};

export default RouteForm;
