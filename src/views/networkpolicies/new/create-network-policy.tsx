import React, { FC } from 'react';
import * as _ from 'lodash';
import { useParams } from 'react-router-dom-v5-compat';
import { NetworkPolicyForm } from './network-policy-form';
import {
  NetworkPolicy,
  isNetworkPolicyConversionError,
  networkPolicyFromK8sResource,
  networkPolicyNormalizeK8sResource,
  networkPolicyToK8sResource,
} from '@utils/models';

import './_create-network-policy.scss';
import { NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import { NetworkPolicyKind } from '@utils/resources/networkpolicies/types';
import { CodeEditor } from '@openshift-console/dynamic-plugin-sdk';
import { Text, TextContent, TextVariants, Title } from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { SyncedEditor } from '@utils/components/SyncedEditor/SyncedEditor';
import { EditorType } from '@utils/components/SyncedEditor/EditorToggle';

const LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY =
  'console.createNetworkPolicy.editor.lastView';

const CreateNetworkPolicy: FC = () => {
  const { t } = useNetworkingTranslation();

  const p = useParams();
  const params: any = { ...p, plural: NetworkPolicyModel.plural };
  const initialPolicy: NetworkPolicy = {
    name: '',
    namespace: params.ns,
    podSelector: [['', '']],
    ingress: {
      denyAll: false,
      rules: [],
    },
    egress: {
      denyAll: false,
      rules: [],
    },
  };

  const formHelpText = t('Create by completing the form.');
  const yamlHelpText = t(
    'Create by manually entering YAML or JSON definitions, or by dragging and dropping a file into the editor.',
  );

  const [helpText, setHelpText] = React.useState(formHelpText);

  const k8sObj = networkPolicyToK8sResource(initialPolicy);

  const YAMLEditor: React.FC<YAMLEditorProps> = ({
    onChange,
    initialYAML = '',
  }) => {
    return <CodeEditor onChange={onChange} value={initialYAML} />;
  };

  const checkPolicyValidForForm = (obj: NetworkPolicyKind) => {
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

  console.log(k8sObj);

  return (
    <>
      <div className="co-m-nav-title co-m-nav-title--detail">
        <div>
          <Title headingLevel="h2">{t('NetworkPolicies')}</Title>
          <TextContent>
            <Text
              component={TextVariants.p}
              className="help-block co-m-pane__heading-help-text"
            >
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
        FormEditor={NetworkPolicyForm}
        initialData={k8sObj}
        initialType={EditorType.Form}
        onChangeEditorType={(type) =>
          setHelpText(type === EditorType.Form ? formHelpText : yamlHelpText)
        }
        onChange={checkPolicyValidForForm}
        YAMLEditor={YAMLEditor}
        lastViewUserSettingKey={LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY}
        displayConversionError
      />
    </>
  );
};

export default CreateNetworkPolicy;
