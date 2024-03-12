import React, { FC, Ref, useState } from 'react';

import { Dropdown, DropdownItem, MenuToggle, MenuToggleElement } from '@patternfly/react-core';
import { NetworkPolicyPort } from '@utils/models';

type PortsDropdownProps = {
  index: number;
  onSingleChange: (port: NetworkPolicyPort, index: number) => void;
  port: NetworkPolicyPort;
};

const PortsDropdown: FC<PortsDropdownProps> = ({ index, onSingleChange, port }) => {
  const key = `${port.key}-${index}`;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Dropdown
      data-test="port-protocol"
      isOpen={isDropdownOpen}
      onSelect={(event, protocol) => {
        setIsDropdownOpen(false);
        onSingleChange({ ...port, protocol: protocol.toString() }, index);
      }}
      selected={port.protocol}
      toggle={(toggleRef: Ref<MenuToggleElement>) => (
        <MenuToggle
          id={`toggle-${key}`}
          isExpanded={isDropdownOpen}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          ref={toggleRef}
        >
          {port.protocol}
        </MenuToggle>
      )}
    >
      <DropdownItem value="TCP">TCP</DropdownItem>

      <DropdownItem value="UDP">UDP</DropdownItem>

      <DropdownItem value="SCTP">SCTP</DropdownItem>
    </Dropdown>
  );
};

export default PortsDropdown;
