import React, { FC, Ref, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  Dropdown,
  DropdownItem,
  DropdownList,
  FormGroup,
  MenuToggle,
  MenuToggleElement,
  TextInput,
} from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { UserDefinedNetworkRole } from '@utils/resources/udns/types';

import { TopologyKeys, UserDefinedNetworkFormInput } from '../utils/types';

import UDNSubnets from './UDNSubnets';

const Layer3Parameters: FC = () => {
  const { t } = useNetworkingTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const { control, register } = useFormContext<UserDefinedNetworkFormInput>();
  return (
    <>
      <FormGroup label={t('MTU')}>
        <TextInput
          type="number"
          {...register(`${TopologyKeys.Layer3}.mtu`, { max: 65536, min: 0, required: false })}
        />
      </FormGroup>
      <FormGroup label={t('Role')}>
        <Controller
          control={control}
          name={`${TopologyKeys.Layer3}.role`}
          render={({ field: { onChange, value } }) => (
            <Dropdown
              id="role-dropdown"
              isOpen={isDropdownOpen}
              onSelect={() => setIsDropdownOpen(false)}
              selected={value}
              toggle={(toggleRef: Ref<MenuToggleElement>) => (
                <MenuToggle
                  id="role-toggle"
                  isExpanded={isDropdownOpen}
                  isFullWidth
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  ref={toggleRef}
                >
                  {value || t('Select role')}
                </MenuToggle>
              )}
            >
              <DropdownList>
                {Object.values(UserDefinedNetworkRole).map((role) => {
                  return (
                    <DropdownItem
                      key={role}
                      onClick={() => {
                        onChange(role);
                      }}
                      value={role}
                    >
                      {role}
                    </DropdownItem>
                  );
                })}
              </DropdownList>
            </Dropdown>
          )}
          rules={{ required: true }}
        />
      </FormGroup>
      <Controller
        control={control}
        name={`${TopologyKeys.Layer3}.subnets`}
        render={({ field: { onChange, value } }) => (
          <UDNSubnets
            description={t('Subnets are used for the pod network across the cluster.')}
            onSubnetsChange={onChange}
            subnets={value || [{ cidr: '' }]}
            title={t('Subnets')}
            withHostSubnet
          />
        )}
        rules={{ required: false }}
      />
      <Controller
        control={control}
        name={`${TopologyKeys.Layer3}.joinSubnets`}
        render={({ field: { onChange, value } }) => (
          <UDNSubnets
            description={t('JoinSubnets are used inside the OVN network topology.')}
            onSubnetsChange={onChange}
            subnets={value || []}
            title={t('JoinSubnets')}
          />
        )}
        rules={{ required: false }}
      />
    </>
  );
};

export default Layer3Parameters;
