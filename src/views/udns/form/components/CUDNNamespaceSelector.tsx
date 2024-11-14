import React, { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormGroup, FormSection } from '@patternfly/react-core';
import { MatchExpressions } from '@utils/components/MatchExpression/MatchExpression';
import SelectorInput from '@utils/components/PodSelectorModal/SelectorInput';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

import { UserDefinedNetworkFormInput } from '../utils/types';

const ClusterUserDefinedNetworkNamespaceSelector: FC = () => {
  const { t } = useNetworkingTranslation();
  const { control } = useFormContext<UserDefinedNetworkFormInput>();
  const namespaceSelectorTitle = t('Namespace Selector');
  const matchLabelsTitle = t('Match Labels');
  const matchExpressionsTitle = t('Match Expressions');

  return (
    <FormSection title={namespaceSelectorTitle} titleElement="h2">
      <Controller
        control={control}
        name="namespaceSelector.matchLabels"
        render={({ field: { onChange, value } }) => (
          <FormGroup fieldId="basic-settings-matchLabels" label={matchLabelsTitle}>
            <SelectorInput
              autoFocus
              onChange={(arr) =>
                onChange(
                  arr.reduce((acc, v) => {
                    const split = v.split('=');
                    return (acc[split[0]] = split[1]), acc;
                  }, {}),
                )
              }
              tags={Object.keys(value).map((key) => `${key}=${value[key]}`)}
            />
          </FormGroup>
        )}
      />
      <Controller
        control={control}
        name="namespaceSelector.matchExpressions"
        render={({ field: { onChange, value } }) => (
          <FormGroup fieldId="basic-settings-matchExpressions" label={matchExpressionsTitle}>
            <MatchExpressions matchExpressions={value} onChange={(me) => onChange(me)} />
          </FormGroup>
        )}
      />
    </FormSection>
  );
};

export default ClusterUserDefinedNetworkNamespaceSelector;
