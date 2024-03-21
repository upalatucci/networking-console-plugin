import SriovNetworkNodePolicyModel from '@kubevirt-ui/kubevirt-api/console/models/SriovNetworkNodePolicyModel';
import {
  useK8sWatchResource,
  K8sResourceKind,
  getGroupVersionKindForModel,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  FormGroup,
  Dropdown,
  MenuToggleElement,
  MenuToggle,
  DropdownList,
  DropdownItem,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import React, { FC, Ref, useState } from 'react';
import { Controller } from 'react-hook-form';
import { ParametersComponentProps } from '../../utils/types';
import PopoverHelpIcon from '@utils/components/PopoverHelpIcon/PopoverHelpIcon';
import { NetworkTypeKeys } from '@views/nads/form/utils/types';

const SriovParameters: FC<ParametersComponentProps> = ({ register, control }) => {
  const { t } = useNetworkingTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const [sriovNetNodePoliciesData] = useK8sWatchResource<K8sResourceKind[]>({
    groupVersionKind: getGroupVersionKindForModel(SriovNetworkNodePolicyModel),
    isList: true,
    optional: true,
  });

  return (
    <>
      <FormGroup isRequired label={t('Resource name')}>
        <Controller
          name={`${NetworkTypeKeys.sriovNetworkType}.resourceName`}
          rules={{ required: true }}
          control={control}
          render={({ field: { value, onChange } }) => (
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
                  {value || t('Select resource name')}
                </MenuToggle>
              )}
            >
              <DropdownList>
                {sriovNetNodePoliciesData.map((policy) => {
                  const policyName = policy?.spec?.resourceName;
                  return (
                    <DropdownItem
                      component="button"
                      key={policyName}
                      onClick={() => {
                        onChange(policyName);
                      }}
                      value={policyName}
                    >
                      {policyName}
                    </DropdownItem>
                  );
                })}
              </DropdownList>
            </Dropdown>
          )}
        />
      </FormGroup>
      <FormGroup label={t('IP address management')}>
        <TextArea {...register(`${NetworkTypeKeys.sriovNetworkType}.ipam`)} />
      </FormGroup>
      <FormGroup
        labelIcon={<PopoverHelpIcon bodyContent={t('Example: 100')} />}
        label={t('VLAN tag number')}
      >
        <TextInput {...register(`${NetworkTypeKeys.sriovNetworkType}.vlanTagNum`)} />
      </FormGroup>
    </>
  );
};

export default SriovParameters;
