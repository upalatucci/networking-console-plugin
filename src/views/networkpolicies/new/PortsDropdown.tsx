import React, { FC, Ref, useState } from 'react';

import {
  Dropdown,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import { NetworkPolicyPort } from '@utils/models';

type PortsDropdownProps = {
  onSingleChange: (port: NetworkPolicyPort, index: number) => void;
  port: NetworkPolicyPort;
  index: number;
};

const PortsDropdown: FC<PortsDropdownProps> = ({
  onSingleChange,
  port,
  index,
}) => {
  const key = `${port.key}-${index}`;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Dropdown
      selected={port.protocol}
      onSelect={(event, protocol) => {
        setIsDropdownOpen(false);
        onSingleChange({ ...port, protocol: protocol.toString() }, index);
      }}
      toggle={(toggleRef: Ref<MenuToggleElement>) => (
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
  );
};

export default PortsDropdown;
