import React, { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';

import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import { ALL_NAMESPACES } from '@utils/constants';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

import useIsMultiEnabled from './hooks/useIsMultiEnabled';
import { TAB_INDEXES } from './constants';
import EnableMultiPage from './EnableMultiPage';
import MultiNetworkPolicyList from './MultiNetworkPolicyList';
import NetworkPolicyList from './NetworkPolicyList';
import { getActiveKeyFromPathname, getNetworkPolicyURLTab } from './utils';

export type NetworkPolicyPageNavProps = {
  namespace: string;
};

const NetworkPolicyDetailsPage: FC<NetworkPolicyPageNavProps> = ({ namespace }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const locationTabKey = useMemo(
    () => getActiveKeyFromPathname(location?.pathname),
    [location?.pathname],
  );

  const [isMultiEnabled] = useIsMultiEnabled();
  const { t } = useNetworkingTranslation();

  return (
    <Tabs
      activeKey={locationTabKey}
      onSelect={(_, tabIndex: number | string) => {
        navigate(getNetworkPolicyURLTab(tabIndex, namespace || ALL_NAMESPACES));
      }}
    >
      <Tab
        eventKey={TAB_INDEXES.NETWORK}
        title={<TabTitleText>{t('NetworkPolicies')}</TabTitleText>}
      >
        <NetworkPolicyList namespace={namespace} />
      </Tab>
      {isMultiEnabled ? (
        <Tab
          eventKey={TAB_INDEXES.MULTI_NETWORK}
          title={<TabTitleText>{t('MultiNetworkPolicies')}</TabTitleText>}
        >
          <MultiNetworkPolicyList namespace={namespace} />
        </Tab>
      ) : (
        <Tab
          eventKey={TAB_INDEXES.ENABLE_MULTI}
          title={<TabTitleText>{t('MultiNetworkPolicies')}</TabTitleText>}
        >
          <EnableMultiPage namespace={namespace} />
        </Tab>
      )}
    </Tabs>
  );
};

export default NetworkPolicyDetailsPage;
