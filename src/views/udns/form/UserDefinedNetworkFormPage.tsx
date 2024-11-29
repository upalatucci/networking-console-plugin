import React, { FC } from 'react';

import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { PageSection, PageSectionVariants, Title } from '@patternfly/react-core';
import { EditorType } from '@utils/components/SyncedEditor/EditorToggle';
import { SyncedEditor } from '@utils/components/SyncedEditor/SyncedEditor';
import { safeYAMLToJS } from '@utils/components/SyncedEditor/yaml';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

import { generateDefaultUDN, LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY } from './utils/constants';
import UserDefinedNetworkForm from './UserDefinedNetworkForm';

const UserDefinedNetworkFormPage: FC = () => {
  const { t } = useNetworkingTranslation();

  const UDN_HEADER_LABEL = t('Create UserDefinedNetwork');

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h1">{UDN_HEADER_LABEL}</Title>
      </PageSection>
      <SyncedEditor
        displayConversionError
        FormEditor={UserDefinedNetworkForm}
        initialData={generateDefaultUDN()}
        initialType={EditorType.Form}
        lastViewUserSettingKey={LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY}
        YAMLEditor={({ initialYAML = '', onChange }) => (
          <ResourceYAMLEditor
            create
            hideHeader
            initialResource={safeYAMLToJS(initialYAML)}
            onChange={onChange}
          />
        )}
      />
    </>
  );
};

export default UserDefinedNetworkFormPage;
