import React, { FC, FormEventHandler } from 'react';

import { Alert, AlertVariant, Form, FormGroup, Text, TextInput } from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

import ProjectSelector from './ProjectSelector';

type UserDefinedNetworkCreateFormProps = {
  error: Error;
  onSubmit: FormEventHandler<HTMLFormElement>;
  selectedProjectName: string;
  setSelectedProjectName: (newProjectName: string) => void;
  setSubnet: (newProjectName: string) => void;
  setUDNName: (newProjectName: string) => void;
  subnet: string;
  udnName: string;
};

const UserDefinedNetworkCreateForm: FC<UserDefinedNetworkCreateFormProps> = ({
  error,
  onSubmit,
  selectedProjectName,
  setSelectedProjectName,
  setSubnet,
  setUDNName,
  subnet,
  udnName,
}) => {
  const { t } = useNetworkingTranslation();

  return (
    <Form id="create-udn-form" onSubmit={onSubmit}>
      <Text>
        {t(
          'Define the network used by VirtualMachines and Pods to communicate in the given project',
        )}
      </Text>
      <ProjectSelector
        selectedProjectName={selectedProjectName}
        setSelectedProjectName={setSelectedProjectName}
      />
      <FormGroup fieldId="input-name" isRequired label={t('Name')}>
        <TextInput
          autoFocus
          data-test="input-name"
          id="input-name"
          isRequired
          name="name"
          onChange={(_, value) => setUDNName(value)}
          type="text"
          value={udnName}
        />
      </FormGroup>

      <FormGroup fieldId="input-udn-subnet" isRequired label={t('Subnet')}>
        <TextInput
          autoFocus
          data-test="input-udn-subnet"
          id="input-udn-subnet"
          isRequired
          name="input-udn-subnet"
          onChange={(_, value) => setSubnet(value)}
          type="text"
          value={subnet}
        />
      </FormGroup>
      {error && (
        <Alert isInline title={t('Error')} variant={AlertVariant.danger}>
          {error?.message}
        </Alert>
      )}
    </Form>
  );
};

export default UserDefinedNetworkCreateForm;
