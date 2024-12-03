import React, { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom-v5-compat';

import { k8sCreate, useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';
import { Button, ButtonVariant, Modal, ModalVariant } from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { ClusterUserDefinedNetworkModel, UserDefinedNetworkModel } from '@utils/models';
import { getName, getNamespace, resourcePathFromModel } from '@utils/resources/shared';

import { UDNForm } from './constants';
import UserDefinedNetworkCreateForm from './UserDefinedNetworkCreateForm';
import { getDefaultUDN } from './utils';

type UserDefinedNetworkCreateModalProps = {
  closeModal?: () => void;
  isClusterUDN?: boolean;
};

const UserDefinedNetworkCreateModal: FC<UserDefinedNetworkCreateModalProps> = ({
  closeModal,
  isClusterUDN = false,
}) => {
  const { t } = useNetworkingTranslation();
  const navigate = useNavigate();

  const [activeNamespace] = useActiveNamespace();

  const methods = useForm<UDNForm>({
    defaultValues: getDefaultUDN(isClusterUDN, activeNamespace),
    mode: 'all',
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = methods;

  const [error, setIsError] = useState<Error>();
  const submit = async (udn: UDNForm) => {
    try {
      const model =
        udn.kind === ClusterUserDefinedNetworkModel.kind
          ? ClusterUserDefinedNetworkModel
          : UserDefinedNetworkModel;

      await k8sCreate({
        data: udn,
        model,
      });
      closeModal();

      navigate(resourcePathFromModel(model, getName(udn), getNamespace(udn)));
    } catch (apiError) {
      setIsError(apiError);
    }
  };

  return (
    <Modal
      actions={[
        <Button
          data-test="create-udn-modal"
          form="create-udn-form"
          id="create-udn-modal"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          key="submit"
          type="submit"
          variant={ButtonVariant.primary}
        >
          {t('Create')}
        </Button>,
        <Button
          data-test-id="create-udn-modal"
          isDisabled={isSubmitting}
          key="button"
          onClick={closeModal}
          type="button"
          variant={ButtonVariant.secondary}
        >
          {t('Cancel')}
        </Button>,
      ]}
      isOpen
      onClose={closeModal}
      title={t('Create {{kind}}', {
        kind: isClusterUDN ? ClusterUserDefinedNetworkModel.kind : UserDefinedNetworkModel.kind,
      })}
      variant={ModalVariant.small}
    >
      <FormProvider {...methods}>
        <UserDefinedNetworkCreateForm
          error={error}
          isClusterUDN={isClusterUDN}
          onSubmit={handleSubmit(submit)}
        />
      </FormProvider>
    </Modal>
  );
};

export default UserDefinedNetworkCreateModal;
