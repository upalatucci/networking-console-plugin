import * as React from 'react';
import { Trans } from 'react-i18next';

import { Button } from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

import { NetworkPolicyConditionalSelector } from './network-policy-conditional-selector';
import { NetworkPolicySelectorPreview } from './network-policy-selector-preview';

export const NetworkPolicyPeerSelectors: React.FC<PeerSelectorProps> = (props) => {
  const { t } = useNetworkingTranslation();
  const { direction, namespaceSelector, onChange, podSelector, policyNamespace } = props;

  const handlePodSelectorChange = (updated: string[][]) => {
    onChange(updated, namespaceSelector);
  };

  const handleNamespaceSelectorChange = (updated: string[][]) => {
    onChange(podSelector, updated);
  };
  const podsPreviewPopoverRef = React.useRef();
  let helpTextPodSelector;
  if (direction === 'ingress') {
    helpTextPodSelector = namespaceSelector
      ? t(
          'If no pod selector is provided, traffic from all pods in eligible namespaces will be allowed.',
        )
      : t(
          'If no pod selector is provided, traffic from all pods in this namespace will be allowed.',
        );
  } else {
    helpTextPodSelector = namespaceSelector
      ? t(
          'If no pod selector is provided, traffic to all pods in eligible namespaces will be allowed.',
        )
      : t('If no pod selector is provided, traffic to all pods in this namespace will be allowed.');
  }

  return (
    <>
      {namespaceSelector && (
        <div className="form-group co-create-networkpolicy__namespaceselector">
          <NetworkPolicyConditionalSelector
            dataTest="peer-namespace-selector"
            helpText={t(
              'If no namespace selector is provided, pods from all namespaces will be eligible.',
            )}
            onChange={handleNamespaceSelectorChange}
            selectorType="namespace"
            values={namespaceSelector}
          />
        </div>
      )}
      <div className="form-group co-create-networkpolicy__podselector">
        <NetworkPolicyConditionalSelector
          dataTest="peer-pod-selector"
          helpText={helpTextPodSelector}
          onChange={handlePodSelectorChange}
          selectorType="pod"
          values={podSelector || []}
        />
      </div>
      <p>
        {props.direction === 'ingress' ? (
          <Trans t={t}>
            Show a preview of the{' '}
            <Button
              data-test="show-affected-pods-ingress"
              isInline
              ref={podsPreviewPopoverRef}
              variant="link"
            >
              affected pods
            </Button>{' '}
            that this ingress rule will apply to.
          </Trans>
        ) : (
          <Trans t={t}>
            Show a preview of the{' '}
            <Button
              data-test="show-affected-pods-egress"
              isInline
              ref={podsPreviewPopoverRef}
              variant="link"
            >
              affected pods
            </Button>{' '}
            that this egress rule will apply to.
          </Trans>
        )}
      </p>
      <NetworkPolicySelectorPreview
        dataTest={`pods-preview-${props.direction}`}
        namespaceSelector={namespaceSelector}
        podSelector={podSelector}
        policyNamespace={policyNamespace}
        popoverRef={podsPreviewPopoverRef}
      />
    </>
  );
};

type PeerSelectorProps = {
  direction: 'egress' | 'ingress';
  namespaceSelector?: string[][];
  onChange: (podSelector: string[][], namespaceSelector?: string[][]) => void;
  podSelector: string[][];
  policyNamespace: string;
};
