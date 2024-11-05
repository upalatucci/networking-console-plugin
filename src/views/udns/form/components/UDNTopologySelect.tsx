import React, { FC, Ref, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  Dropdown,
  DropdownItem,
  DropdownList,
  FormGroup,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

import { TopologyKeys, UserDefinedNetworkFormInput } from '../utils/types';

const UserDefinedNetworkTopologySelect: FC = () => {
  const { t } = useNetworkingTranslation();
  const { control } = useFormContext<UserDefinedNetworkFormInput>();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const topologyTitle = t('Topology');

  return (
    <Controller
      control={control}
      name="topology"
      render={({ field: { onChange, value } }) => (
        <FormGroup fieldId="basic-settings-topology" isRequired label={topologyTitle}>
          <Dropdown
            id="topology"
            isOpen={isDropdownOpen}
            onOpenChange={setIsDropdownOpen}
            onSelect={() => setIsDropdownOpen(false)}
            selected={value}
            toggle={(toggleRef: Ref<MenuToggleElement>) => (
              <MenuToggle
                id="toggle-udns-topology"
                isExpanded={isDropdownOpen}
                isFullWidth
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                ref={toggleRef}
              >
                {TopologyKeys[value] || topologyTitle}
              </MenuToggle>
            )}
          >
            <DropdownList>
              {Object.entries(TopologyKeys).map(([key, tk]) => (
                <DropdownItem
                  key={key}
                  onClick={() => {
                    onChange(key);
                  }}
                  value={key}
                >
                  {tk}
                </DropdownItem>
              ))}
            </DropdownList>
          </Dropdown>
        </FormGroup>
      )}
      rules={{ required: true }}
    />
  );
};

export default UserDefinedNetworkTopologySelect;
