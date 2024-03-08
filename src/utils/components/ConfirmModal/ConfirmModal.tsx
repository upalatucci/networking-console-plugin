import React, { FC } from 'react';

import {
  ActionList,
  ActionListItem,
  Button,
  ButtonVariant,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';

import './ConfirmModal.scss';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

export type ConfirmModalProps = {
  executeFn: () => void;
  title: string;
  message: string | JSX.Element;
  btnText: string | JSX.Element;
  closeModal?: () => void;
};

const ConfirmModal: FC<ConfirmModalProps> = ({
  title,
  closeModal,
  executeFn,
  btnText,
  message,
}) => {
  const { t } = useNetworkingTranslation();

  return (
    <Modal
      className="ocs-modal networking-confirm-modal"
      id="confirm-modal"
      isOpen
      onClose={closeModal}
      position={'top'}
      title={title}
      variant={ModalVariant.small}
      titleIconVariant="warning"
      footer={
        <ActionList className="tabmodal-footer">
          <ActionListItem>
            <Button onClick={executeFn} variant={ButtonVariant.primary}>
              {btnText || t('Confirm')}
            </Button>
          </ActionListItem>
          <ActionListItem>
            <Button onClick={closeModal} variant="link">
              {t('Cancel')}
            </Button>
          </ActionListItem>
        </ActionList>
      }
    >
      {message}
    </Modal>
  );
};

export default ConfirmModal;
