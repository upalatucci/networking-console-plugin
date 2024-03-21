import {
  Dropdown,
  DropdownItem,
  DropdownList,
  FormGroup,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import React, { FC, Ref, useState } from 'react';
import { getNetworkTypes } from '../../utils/utils';
import useNetworkModels from '../../hooks/useNetworkModels';
import useOVNK8sNetwork from '../../hooks/useOVNK8sNetwork';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { Control, Controller } from 'react-hook-form';
import { NetworkAttachmentDefinitionFormInput } from '../../utils/types';
import MissingOperatorsAlert from './components/MissingOperatorsAlert';

type NetworkAttachmentDefinitionTypeSelectProps = {
  control: Control<NetworkAttachmentDefinitionFormInput, any>;
};

const NetworkAttachmentDefinitionTypeSelect: FC<NetworkAttachmentDefinitionTypeSelectProps> = ({
  control,
}) => {
  const { t } = useNetworkingTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [hasHyperConvergedCRD, hasSriovNetNodePolicyCRD] = useNetworkModels();
  const [hasOVNK8sNetwork] = useOVNK8sNetwork();

  const networkTypeItems = getNetworkTypes(
    hasSriovNetNodePolicyCRD,
    hasHyperConvergedCRD,
    hasOVNK8sNetwork,
  );

  const networkTypeTitle = t('Network Type');

  return (
    <Controller
      name="networkType"
      control={control}
      rules={{ required: true }}
      render={({ field: { value, onChange } }) => (
        <FormGroup
          className="network-type"
          fieldId="basic-settings-network-type"
          label={networkTypeTitle}
          isRequired
        >
          <MissingOperatorsAlert networkTypeItems={networkTypeItems} />
          <Dropdown
            id="network-type"
            isOpen={isDropdownOpen}
            onSelect={() => setIsDropdownOpen(false)}
            selected={value}
            toggle={(toggleRef: Ref<MenuToggleElement>) => (
              <MenuToggle
                id="toggle-nads-network-type"
                isExpanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                ref={toggleRef}
                isFullWidth
              >
                {networkTypeItems[value] || networkTypeTitle}
              </MenuToggle>
            )}
          >
            <DropdownList>
              {Object.entries(networkTypeItems).map(([type, label]) => (
                <DropdownItem
                  component="button"
                  key={type}
                  onClick={() => {
                    onChange(type);
                  }}
                  value={type}
                >
                  {label}
                </DropdownItem>
              ))}
            </DropdownList>
          </Dropdown>
        </FormGroup>
      )}
    />
  );
};

export default NetworkAttachmentDefinitionTypeSelect;
