import React, { FC } from 'react';

import { Modal, ModalVariant } from '@patternfly/react-core';

export type ConfirmModalProps = {
  executeFn: () => void;
  title: string;
  message: string | JSX.Element;
  btnText: string | JSX.Element;
  close?: () => void;
};

const ConfirmModal: FC<ConfirmModalProps> = ({ title, children }) => {
  return (
    <Modal
      className="ocs-modal networking-confirm-modal"
      id="confirm-modal"
      isOpen={true}
      onClose={close}
      position={'top'}
      title={title}
      variant={ModalVariant.small}
    >
      {children}
    </Modal>
  );
};

export default ConfirmModal;
