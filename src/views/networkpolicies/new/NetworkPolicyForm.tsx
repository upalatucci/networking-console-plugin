import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom-v5-compat';

import { NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import { CodeEditor, ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import {
  PageSection,
  PageSectionVariants,
  Text,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { EditorType } from '@utils/components/SyncedEditor/EditorToggle';
import { SyncedEditor } from '@utils/components/SyncedEditor/SyncedEditor';
import { MultiNetworkPolicyModel, networkPolicyToK8sResource } from '@utils/models';

import useIsMultiNetworkPolicy from './hooks/useIsMultiNetworkPolicy';
import { LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY } from './utils/const';
import { FORM_HELPER_TEXT, getInitialPolicy, YAM_HELPER_TEXT } from './utils/utils';
import NetworkPolicyFormSections from './NetworkPolicyFormSections';
import { safeYAMLToJS } from '@utils/components/SyncedEditor/yaml';

const NetworkPolicyForm: FC = () => {
  const { ns } = useParams();
  const [helpText, setHelpText] = useState<string>(FORM_HELPER_TEXT);
  const isMultiCreateForm = useIsMultiNetworkPolicy();

  const k8sObj = networkPolicyToK8sResource(getInitialPolicy(ns));

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h2">
          {isMultiCreateForm ? MultiNetworkPolicyModel.labelPlural : NetworkPolicyModel.labelPlural}
        </Title>
        <Text component={TextVariants.p}>{helpText}</Text>
      </PageSection>
      <SyncedEditor
        displayConversionError
        FormEditor={NetworkPolicyFormSections}
        initialData={k8sObj}
        initialType={EditorType.Form}
        lastViewUserSettingKey={LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY}
        onChangeEditorType={(type) =>
          setHelpText(type === EditorType.Form ? FORM_HELPER_TEXT : YAM_HELPER_TEXT)
        }
        YAMLEditor={({ initialYAML = '', onChange }) => (
          <ResourceYAMLEditor
            create
            onChange={onChange}
            initialResource={safeYAMLToJS(initialYAML)}
            hideHeader
          />
        )}
      />
    </>
  );
};

export default NetworkPolicyForm;
