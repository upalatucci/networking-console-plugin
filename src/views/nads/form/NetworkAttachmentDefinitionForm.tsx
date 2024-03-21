import NetworkAttachmentDefinitionModel from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import {
  ActionGroup,
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  TextInput,
} from '@patternfly/react-core';
import { DEFAULT_NAMESPACE } from '@utils/constants';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { isEmpty, resourcePathFromModel } from '@utils/utils';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import NetworkAttachmentDefinitionTypeSelect from './components/NADTypeSelect/NetworkAttachmentDefinitionTypeSelect';
import { createNetAttachDef, generateNADName } from './utils/utils';
import { useForm } from 'react-hook-form';
import { NetworkAttachmentDefinitionFormInput } from './utils/types';
import NetworkTypeParameters from './components/NetworkTypeParameters/NetworkTypeParameters';
import NetworkAttachmentDefinitionFormTitle from './components/FormTitle/NetworkAttachmentDefinitionFormTitle';
import PopoverHelpIcon from '@utils/components/PopoverHelpIcon/PopoverHelpIcon';

type NetworkAttachmentDefinitionFormProps = {
  namespace: string;
};

const NetworkAttachmentDefinitionForm: FC<NetworkAttachmentDefinitionFormProps> = ({
  namespace = DEFAULT_NAMESPACE,
}) => {
  const { t } = useNetworkingTranslation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
    control,
    watch,
  } = useForm<NetworkAttachmentDefinitionFormInput>({
    defaultValues: {
      name: generateNADName(),
    },
  });

  const networkType = watch('networkType');

  const onSubmit = (data: NetworkAttachmentDefinitionFormInput) => {
    createNetAttachDef(data, namespace)
      .then(() => {
        navigate(resourcePathFromModel(NetworkAttachmentDefinitionModel, data?.name, namespace));
      })
      .catch((err) => {
        setError('root', err?.json);
      });
  };

  return (
    <div className="co-m-pane__body co-m-pane__form">
      <NetworkAttachmentDefinitionFormTitle />
      <Form className="nad-form" onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          fieldId="name"
          isRequired
          label={t('Name')}
          labelIcon={
            <PopoverHelpIcon
              bodyContent={t(
                'Networks are not project-bound. Using the same name creates a shared NAD.',
              )}
            />
          }
        >
          <TextInput {...register('name', { required: true })} />
        </FormGroup>
        <FormGroup fieldId="description" label={t('Description')}>
          <TextInput {...register('description')} />
        </FormGroup>
        <NetworkAttachmentDefinitionTypeSelect control={control} />
        <NetworkTypeParameters register={register} networkType={networkType} control={control} />
        {!isEmpty(errors?.root) && (
          <Alert isInline title={t('Error')} variant={AlertVariant.danger}>
            {errors?.root?.message}
          </Alert>
        )}
        <ActionGroup className="pf-v5-c-form">
          <Button
            id="save-changes"
            isDisabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
            type="submit"
            variant="primary"
          >
            {t('Create')}
          </Button>
          <Button
            id="cancel"
            onClick={() => navigate(-1)}
            type="button"
            variant={ButtonVariant.secondary}
          >
            {t('Cancel')}
          </Button>
        </ActionGroup>
      </Form>
    </div>
  );
};

export default NetworkAttachmentDefinitionForm;
