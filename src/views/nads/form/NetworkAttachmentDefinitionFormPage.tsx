import React, { FC } from 'react';

import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { PageSection, PageSectionVariants, Title } from '@patternfly/react-core';
import { EditorType } from '@utils/components/SyncedEditor/EditorToggle';
import { SyncedEditor } from '@utils/components/SyncedEditor/SyncedEditor';
import { safeYAMLToJS } from '@utils/components/SyncedEditor/yaml';
import { NET_ATTACH_DEF_HEADER_LABEL } from '@utils/constants';
import { LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY } from '@views/networkpolicies/new/utils/const';

import { defaultNAD } from './utils/constants';
import NetworkAttachmentDefinitionForm from './NetworkAttachmentDefinitionForm';

const NetworkAttachmentDefinitionFormPage: FC = () => (
  <>
    <PageSection variant={PageSectionVariants.light}>
      <Title headingLevel="h1">{NET_ATTACH_DEF_HEADER_LABEL}</Title>
    </PageSection>
    <SyncedEditor
      displayConversionError
      FormEditor={NetworkAttachmentDefinitionForm}
      initialData={defaultNAD}
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

export default NetworkAttachmentDefinitionFormPage;
