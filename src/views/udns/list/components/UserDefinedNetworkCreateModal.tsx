import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import { k8sCreate, useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';
import { Button, ButtonVariant, Modal, ModalVariant } from '@patternfly/react-core';
import { ALL_NAMESPACES_KEY } from '@utils/constants';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { UserDefinedNetworkModel } from '@utils/models';
import { resourcePathFromModel } from '@utils/resources/shared';

import UserDefinedNetworkCreateForm from './UserDefinedNetworkCreateForm';
import { createUDN } from './utils';

type UserDefinedNetworkCreateModalProps = {
  closeModal?: () => void;
};

const UserDefinedNetworkCreateModal: FC<UserDefinedNetworkCreateModalProps> = ({ closeModal }) => {
  const { t } = useNetworkingTranslation();
  const navigate = useNavigate();

  const [activeNamespace] = useActiveNamespace();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setIsError] = useState<Error>();
  const [selectedProjectName, setSelectedProjectName] = useState<string>(
    activeNamespace !== ALL_NAMESPACES_KEY ? activeNamespace : null,
  );
  const [udnName, setUDNName] = useState<string>();
  const [subnet, setSubnet] = useState<string>();

  const submit = async (event) => {
    setIsSubmitting(true);
    event.preventDefault();
    try {
      const udn = createUDN(udnName, selectedProjectName, subnet);

      await k8sCreate({
        data: udn,
        model: UserDefinedNetworkModel,
      });
      closeModal();

      navigate(resourcePathFromModel(UserDefinedNetworkModel, udnName, selectedProjectName));
    } catch (apiError) {
      setIsError(apiError);
    }

    setIsSubmitting(false);
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
      title={t('Create UserDefinedNetwork')}
      variant={ModalVariant.small}
    >
      <UserDefinedNetworkCreateForm
        error={error}
        onSubmit={submit}
        selectedProjectName={selectedProjectName}
        setSelectedProjectName={setSelectedProjectName}
        setSubnet={setSubnet}
        setUDNName={setUDNName}
        subnet={subnet}
        udnName={udnName}
      />
    </Modal>
  );
};

export default UserDefinedNetworkCreateModal;
