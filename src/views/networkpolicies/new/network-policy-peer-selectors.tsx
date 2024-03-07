import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { Trans } from 'react-i18next';
import { NetworkPolicyConditionalSelector } from './network-policy-conditional-selector';
import { NetworkPolicySelectorPreview } from './network-policy-selector-preview';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

export const NetworkPolicyPeerSelectors: React.FC<PeerSelectorProps> = (
  props,
) => {
  const { t } = useNetworkingTranslation();
  const {
    policyNamespace,
    direction,
    onChange,
    podSelector,
    namespaceSelector,
  } = props;

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
      : t(
          'If no pod selector is provided, traffic to all pods in this namespace will be allowed.',
        );
  }

  return (
    <>
      {namespaceSelector && (
        <div className="form-group co-create-networkpolicy__namespaceselector">
          <NetworkPolicyConditionalSelector
            selectorType="namespace"
            helpText={t(
              'If no namespace selector is provided, pods from all namespaces will be eligible.',
            )}
            values={namespaceSelector}
            onChange={handleNamespaceSelectorChange}
            dataTest="peer-namespace-selector"
          />
        </div>
      )}
      <div className="form-group co-create-networkpolicy__podselector">
        <NetworkPolicyConditionalSelector
          selectorType="pod"
          helpText={helpTextPodSelector}
          values={podSelector || []}
          onChange={handlePodSelectorChange}
          dataTest="peer-pod-selector"
        />
      </div>
      <p>
        {props.direction === 'ingress' ? (
          <Trans t={t}>
            Show a preview of the{' '}
            <Button
              data-test="show-affected-pods-ingress"
              ref={podsPreviewPopoverRef}
              variant="link"
              isInline
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
              ref={podsPreviewPopoverRef}
              variant="link"
              isInline
            >
              affected pods
            </Button>{' '}
            that this egress rule will apply to.
          </Trans>
        )}
      </p>
      <NetworkPolicySelectorPreview
        policyNamespace={policyNamespace}
        podSelector={podSelector}
        namespaceSelector={namespaceSelector}
        popoverRef={podsPreviewPopoverRef}
        dataTest={`pods-preview-${props.direction}`}
      />
    </>
  );
};

type PeerSelectorProps = {
  policyNamespace: string;
  podSelector: string[][];
  namespaceSelector?: string[][];
  direction: 'ingress' | 'egress';
  onChange: (podSelector: string[][], namespaceSelector?: string[][]) => void;
};
