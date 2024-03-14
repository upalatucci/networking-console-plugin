import React, { FC } from 'react';
import { useParams } from 'react-router-dom-v5-compat';
import * as _ from 'lodash';

import { NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import { CodeEditor } from '@openshift-console/dynamic-plugin-sdk';
import { Text, TextContent, TextVariants, Title } from '@patternfly/react-core';
import { EditorType } from '@utils/components/SyncedEditor/EditorToggle';
import { SyncedEditor } from '@utils/components/SyncedEditor/SyncedEditor';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import {
  isNetworkPolicyConversionError,
  NetworkPolicy,
  networkPolicyFromK8sResource,
  networkPolicyNormalizeK8sResource,
  networkPolicyToK8sResource,
} from '@utils/models';

import { NetworkPolicyForm } from './network-policy-form';

import './_create-network-policy.scss';
import { IoK8sApiNetworkingV1NetworkPolicy } from '@kubevirt-ui/kubevirt-api/kubernetes/models';

const LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY = 'console.createNetworkPolicy.editor.lastView';

const CreateNetworkPolicy: FC = () => {
  const { t } = useNetworkingTranslation();

  const p = useParams();
  const params: any = { ...p, plural: NetworkPolicyModel.plural };
  const initialPolicy: NetworkPolicy = {
    egress: {
      denyAll: false,
      rules: [],
    },
    ingress: {
      denyAll: false,
      rules: [],
    },
    name: '',
    namespace: params.ns,
    podSelector: [['', '']],
  };

  const formHelpText = t('Create by completing the form.');
  const yamlHelpText = t(
    'Create by manually entering YAML or JSON definitions, or by dragging and dropping a file into the editor.',
  );

  const [helpText, setHelpText] = React.useState(formHelpText);

  const k8sObj = networkPolicyToK8sResource(initialPolicy);

  const YAMLEditor: React.FC<YAMLEditorProps> = ({ initialYAML = '', onChange }) => {
    return <CodeEditor onChange={onChange} value={initialYAML} />;
  };

  const checkPolicyValidForForm = (obj: IoK8sApiNetworkingV1NetworkPolicy) => {
    const normalizedK8S = networkPolicyNormalizeK8sResource(obj);
    const converted = networkPolicyFromK8sResource(normalizedK8S, t);
    if (isNetworkPolicyConversionError(converted)) {
      throw converted.error;
    } else {
      // Convert back to check for unsupported fields (check isomorphism)
      const reconverted = networkPolicyToK8sResource(converted);
      if (!_.isEqual(normalizedK8S, reconverted)) {
        throw new Error(
          t(
            'Not all YAML property values are supported in the form editor. Some data would be lost.',
          ),
        );
      }
    }
  };

  type YAMLEditorProps = {
    initialYAML?: string;
    onChange?: (yaml: string) => void;
  };

  return (
    <>
      <div className="co-m-nav-title co-m-nav-title--detail">
        <div>
          <Title headingLevel="h2">{t('NetworkPolicies')}</Title>
          <TextContent>
            <Text className="help-block co-m-pane__heading-help-text" component={TextVariants.p}>
              {helpText}
            </Text>
          </TextContent>
        </div>
      </div>

      <SyncedEditor
        context={{
          formContext: { networkPolicy: initialPolicy },
          yamlContext: {},
        }}
        displayConversionError
        FormEditor={NetworkPolicyForm}
        initialData={k8sObj}
        initialType={EditorType.Form}
        lastViewUserSettingKey={LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY}
        onChange={checkPolicyValidForForm}
        onChangeEditorType={(type) =>
          setHelpText(type === EditorType.Form ? formHelpText : yamlHelpText)
        }
        YAMLEditor={YAMLEditor}
      />
    </>
  );
};

export default CreateNetworkPolicy;
