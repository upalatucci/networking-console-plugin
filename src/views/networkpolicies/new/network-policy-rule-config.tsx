import * as React from 'react';
import * as _ from 'lodash';

import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Divider,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
} from '@patternfly/react-core';
import { TrashIcon } from '@patternfly/react-icons/dist/esm/icons/trash-icon';
import { t, useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { NetworkPolicyPeer, NetworkPolicyRule } from '@utils/models';

import {
  NetworkPolicyAddPeerDropdown,
  NetworkPolicyPeerType,
} from './network-policy-add-peer-dropdown';
import { NetworkPolicyPeerIPBlock } from './network-policy-peer-ipblock';
import { NetworkPolicyPeerSelectors } from './network-policy-peer-selectors';
import { NetworkPolicyPorts } from './network-policy-ports';

const getPeerRuleTitle = (direction: 'egress' | 'ingress', peer: NetworkPolicyPeer) => {
  if (peer.ipBlock) {
    return direction === 'ingress'
      ? t('Allow traffic from peers by IP block')
      : t('Allow traffic to peers by IP block');
  }
  if (peer.namespaceSelector) {
    return direction === 'ingress'
      ? t('Allow traffic from pods inside the cluster')
      : t('Allow traffic to pods inside the cluster');
  }
  return direction === 'ingress'
    ? t('Allow traffic from pods in the same namespace')
    : t('Allow traffic to pods in the same namespace');
};

const emptyPeer = (type: NetworkPolicyPeerType): NetworkPolicyPeer => {
  const key = _.uniqueId();
  switch (type) {
    case 'sameNS':
      return {
        key,
        podSelector: [],
      };
    case 'anyNS':
      return {
        key,
        namespaceSelector: [],
        podSelector: [],
      };
    case 'ipBlock':
    default:
      return {
        ipBlock: { cidr: '', except: [] },
        key,
      };
  }
};

export const NetworkPolicyRuleConfigPanel: React.FunctionComponent<RuleConfigProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { t } = useNetworkingTranslation();
  const { direction, onChange, onRemove, policyNamespace, rule } = props;
  const peersHelp =
    direction === 'ingress'
      ? t(
          'Sources added to this rule will allow traffic to the pods defined above. Sources in this list are combined using a logical OR operation.',
        )
      : t(
          'Destinations added to this rule will allow traffic from the pods defined above. Destinations in this list are combined using a logical OR operation.',
        );

  const addPeer = (type: NetworkPolicyPeerType) => {
    rule.peers = [emptyPeer(type), ...rule.peers];
    onChange(rule);
  };

  const removePeer = (idx: number) => {
    rule.peers = [...rule.peers.slice(0, idx), ...rule.peers.slice(idx + 1)];
    onChange(rule);
  };

  return (
    <Card>
      <CardTitle component="h4">
        <div className="co-create-networkpolicy__rule-header">
          <label>{direction === 'ingress' ? t('Ingress rule') : t('Egress rule')}</label>
          <div className="co-create-networkpolicy__rule-header-right">
            <Button data-test={`remove-${direction}-rule`} onClick={onRemove} variant="link">
              {t('Remove')}
            </Button>
          </div>
          <NetworkPolicyAddPeerDropdown
            onSelect={addPeer}
            title={direction === 'ingress' ? t('Add allowed source') : t('Add allowed destination')}
          />
        </div>
      </CardTitle>
      <CardBody>
        <div className="help-block" id="ingress-peers-help">
          <p>{peersHelp}</p>
        </div>
      </CardBody>
      <CardBody>
        {rule.peers.map((peer, idx) => {
          const peerPanel = peer.ipBlock ? (
            <NetworkPolicyPeerIPBlock
              direction={direction}
              ipBlock={peer.ipBlock}
              onChange={(ipBlock) => {
                rule.peers[idx].ipBlock = ipBlock;
                onChange(rule);
              }}
            />
          ) : (
            <NetworkPolicyPeerSelectors
              direction={direction}
              namespaceSelector={peer.namespaceSelector}
              onChange={(podSel, nsSel) => {
                rule.peers[idx].podSelector = podSel;
                rule.peers[idx].namespaceSelector = nsSel;
                onChange(rule);
              }}
              podSelector={peer.podSelector || []}
              policyNamespace={policyNamespace}
            />
          );
          return (
            <div className="form-group" key={peer.key}>
              <FormFieldGroupExpandable
                header={
                  <FormFieldGroupHeader
                    actions={
                      <Button
                        aria-label={t('Remove peer')}
                        className="co-create-networkpolicy__remove-peer"
                        data-test="remove-peer"
                        onClick={() => removePeer(idx)}
                        type="button"
                        variant="plain"
                      >
                        <TrashIcon />
                      </Button>
                    }
                    titleText={{
                      id: `peer-header-${idx}`,
                      text: getPeerRuleTitle(direction, peer),
                    }}
                  />
                }
                isExpanded
                toggleAriaLabel="Peer"
              >
                {peerPanel}
              </FormFieldGroupExpandable>
              <Divider />
            </div>
          );
        })}
        <NetworkPolicyPorts
          onChange={(ports) => {
            rule.ports = ports;
            onChange(rule);
          }}
          ports={rule.ports}
        />
      </CardBody>
    </Card>
  );
};

type RuleConfigProps = {
  direction: 'egress' | 'ingress';
  onChange: (rule: NetworkPolicyRule) => void;
  onRemove: () => void;
  policyNamespace: string;
  rule: NetworkPolicyRule;
};
