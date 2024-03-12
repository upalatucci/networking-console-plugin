import * as React from 'react';

import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

export type NetworkPolicyPeerType = 'anyNS' | 'ipBlock' | 'sameNS';

export const NetworkPolicyAddPeerDropdown: React.FunctionComponent<
  NetworkPolicyAddPeerDropdownProps
> = (props) => {
  const { t } = useNetworkingTranslation();
  const { onSelect, title } = props;

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <div className="form-group co-create-networkpolicy__add-peer">
      <Dropdown
        data-test="add-peer"
        isOpen={isDropdownOpen}
        onSelect={(event, networkType: NetworkPolicyPeerType) => {
          onSelect(networkType);
          setIsDropdownOpen(false);
        }}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle
            id="toggle-basic"
            isExpanded={isDropdownOpen}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            ref={toggleRef}
          >
            {title}
          </MenuToggle>
        )}
      >
        <DropdownList className="add-peer-dropdown">
          <DropdownItem value="sameNS">{t('Allow pods from the same namespace')}</DropdownItem>
          <DropdownItem value="anyNS">{t('Allow pods from inside the cluster')}</DropdownItem>
          <DropdownItem value="ipblock">{t('Allow peers by IP block')}</DropdownItem>
        </DropdownList>
      </Dropdown>
    </div>
  );
};

type NetworkPolicyAddPeerDropdownProps = {
  onSelect: (type: NetworkPolicyPeerType) => void;
  title: string;
};
