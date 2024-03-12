import * as React from 'react';
import * as _ from 'lodash';

import { Button } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { NetworkPolicyPort } from '@utils/models';

import PortsDropdown from './PortsDropdown';

export const NetworkPolicyPorts: React.FunctionComponent<NetworkPolicyPortsProps> = (props) => {
  const { onChange, ports } = props;
  const { t } = useNetworkingTranslation();

  const onSingleChange = (port: NetworkPolicyPort, index: number) => {
    onChange([...ports.slice(0, index), port, ...ports.slice(index + 1)]);
  };

  const onRemove = (index: number) => {
    onChange([...ports.slice(0, index), ...ports.slice(index + 1)]);
  };

  return (
    <>
      {
        <div className="form-group co-create-networkpolicy__ports-list">
          <label>{t('Ports')}</label>
          <div className="help-block" id="ingress-peers-help">
            <p>
              {t(
                'Add ports to restrict traffic through them. If no ports are provided, your policy will make all ports accessible to traffic.',
              )}
            </p>
          </div>
          {ports.map((port, idx) => {
            const key = `${port}-${idx}`;
            return (
              <div className="pf-v5-c-input-group" key={key}>
                <PortsDropdown index={idx} onSingleChange={onSingleChange} port={port} />
                <input
                  aria-describedby="ports-help"
                  className="pf-v5-c-form-control"
                  data-test="port-input"
                  id={`${key}-port`}
                  name={`${key}-port`}
                  onChange={(event) =>
                    onSingleChange({ ...port, port: event.currentTarget.value }, idx)
                  }
                  placeholder="443"
                  value={port.port}
                />
                <Button
                  aria-label={t('Remove port')}
                  className="co-create-networkpolicy__remove-port"
                  data-test="remove-port"
                  onClick={() => onRemove(idx)}
                  type="button"
                  variant="plain"
                >
                  <MinusCircleIcon />
                </Button>
              </div>
            );
          })}
          <div className="co-toolbar__group co-toolbar__group--left co-create-networkpolicy__add-port">
            <Button
              className="pf-m-link--align-left"
              data-test="add-port"
              onClick={() => {
                onChange([...ports, { key: _.uniqueId('port-'), port: '', protocol: 'TCP' }]);
              }}
              type="button"
              variant="link"
            >
              <PlusCircleIcon className="co-icon-space-r" />
              {t('Add port')}
            </Button>
          </div>
        </div>
      }
    </>
  );
};

type NetworkPolicyPortsProps = {
  onChange: (ports: NetworkPolicyPort[]) => void;
  ports: NetworkPolicyPort[];
};
