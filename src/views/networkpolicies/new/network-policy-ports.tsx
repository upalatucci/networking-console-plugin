import * as React from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import * as _ from 'lodash';
import { NetworkPolicyPort } from '@utils/models';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

export const NetworkPolicyPorts: React.FunctionComponent<
  NetworkPolicyPortsProps
> = (props) => {
  const { ports, onChange } = props;
  const { t } = useNetworkingTranslation();

  const onSingleChange = (port: NetworkPolicyPort, index: number) => {
    onChange([...ports.slice(0, index), port, ...ports.slice(index + 1)]);
  };

  const onRemove = (index: number) => {
    onChange([...ports.slice(0, index), ...ports.slice(index + 1)]);
  };

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

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
            const key = `port-${idx}`;
            return (
              <div className="pf-v5-c-input-group" key={key}>
                <Dropdown
                  selected={port.protocol}
                  onSelect={(event, protocol) => {
                    setIsDropdownOpen(false);
                    onSingleChange(
                      { ...port, protocol: protocol.toString() },
                      idx,
                    );
                  }}
                  toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                    <MenuToggle
                      id={`toggle-${key}`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      isExpanded={isDropdownOpen}
                      ref={toggleRef}
                    >
                      {port.protocol}
                    </MenuToggle>
                  )}
                  isOpen={isDropdownOpen}
                  data-test="port-protocol"
                >
                  <DropdownItem value="TCP">TCP</DropdownItem>

                  <DropdownItem value="UDP">UDP</DropdownItem>

                  <DropdownItem value="SCTP">SCTP</DropdownItem>
                </Dropdown>
                <input
                  className="pf-v5-c-form-control"
                  onChange={(event) =>
                    onSingleChange(
                      { ...port, port: event.currentTarget.value },
                      idx,
                    )
                  }
                  placeholder="443"
                  aria-describedby="ports-help"
                  name={`${key}-port`}
                  id={`${key}-port`}
                  value={port.port}
                  data-test="port-input"
                />
                <Button
                  aria-label={t('Remove port')}
                  className="co-create-networkpolicy__remove-port"
                  onClick={() => onRemove(idx)}
                  type="button"
                  variant="plain"
                  data-test="remove-port"
                >
                  <MinusCircleIcon />
                </Button>
              </div>
            );
          })}
          <div className="co-toolbar__group co-toolbar__group--left co-create-networkpolicy__add-port">
            <Button
              className="pf-m-link--align-left"
              onClick={() => {
                onChange([
                  ...ports,
                  { key: _.uniqueId('port-'), port: '', protocol: 'TCP' },
                ]);
              }}
              type="button"
              variant="link"
              data-test="add-port"
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
  ports: NetworkPolicyPort[];
  onChange: (ports: NetworkPolicyPort[]) => void;
};
