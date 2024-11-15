import React, { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Flex, FlexItem, FormGroup, FormSection, Popover } from '@patternfly/react-core';
import FormGroupHelperText from '@utils/components/FormGroupHelperText/FormGroupHelperText';
import { MatchExpressions } from '@utils/components/MatchExpression/MatchExpression';
import SelectorInput from '@utils/components/PodSelectorModal/SelectorInput';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

import { UserDefinedNetworkFormInput } from '../utils/types';

const ClusterUserDefinedNetworkNamespaceSelector: FC = () => {
  const { t } = useNetworkingTranslation();
  const { control } = useFormContext<UserDefinedNetworkFormInput>();
  const namespaceSelectorTitle = t('Namespace Selector');

  return (
    <FormSection title={namespaceSelectorTitle} titleElement="h2">
      <Controller
        control={control}
        name="namespaceSelector.matchLabels"
        render={({ field: { onChange, value } }) => (
          <FormGroup fieldId="basic-settings-matchLabels" label={t('Match Labels')}>
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
            <FormGroupHelperText>
              {t(
                'matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels map is equivalent to an element of matchExpressions, whose key field is "key", the operator is "In", and the values array contains only "value". The requirements are ANDed.',
              )}
            </FormGroupHelperText>
          </FormGroup>
        )}
      />
      <Controller
        control={control}
        name="namespaceSelector.matchExpressions"
        render={({ field: { onChange, value } }) => (
          <FormGroup
            fieldId="basic-settings-matchExpressions"
            label={
              <Popover
                bodyContent={
                  <Flex direction={{ default: 'column' }}>
                    <FlexItem>{` - ${t('key is the label key that the selector applies')}`}</FlexItem>
                    <FlexItem>{` - ${t("operator represents a key's relationship to a set of values. Valid operators are In, NotIn, Exists and DoesNotExist.")}`}</FlexItem>
                    <FlexItem>{` - ${t('values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.')}`}</FlexItem>
                  </Flex>
                }
              >
                <label className="pf-v5-c-form__label">{t('Match Expressions')}</label>
              </Popover>
            }
          >
            <MatchExpressions matchExpressions={value} onChange={(me) => onChange(me)} />
            <FormGroupHelperText>
              {t(
                'matchExpressions is a list of label selector requirements. The requirements are ANDed.',
              )}
            </FormGroupHelperText>
          </FormGroup>
        )}
      />
    </FormSection>
  );
};

export default ClusterUserDefinedNetworkNamespaceSelector;
