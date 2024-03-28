import React, { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';

import { modelToRef, NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import { useLastNamespacePath } from '@utils/hooks/useLastNamespacePath';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { MultiNetworkPolicyModel } from '@utils/models';

import useIsMultiEnabled from './hooks/useIsMultiEnabled';
import { TAB_INDEXES } from './constants';
import EnableMultiPage from './EnableMultiPage';
import MultiNetworkPolicyList from './MultiNetworkPolicyList';
import NetworkPolicyList from './NetworkPolicyList';
import { getActiveKeyFromPathname } from './utils';

export type NetworkPolicyPageNavProps = {
  namespace: string;
};

const NetworkPolicyDetailsPage: FC<NetworkPolicyPageNavProps> = ({ namespace }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastNamespacePath = useLastNamespacePath();
  const [activeTabKey, setActiveTabKey] = useState<number | string>(
    getActiveKeyFromPathname(location?.pathname),
  );

  const [isMultiEnabled] = useIsMultiEnabled();

  useEffect(() => {
    if (activeTabKey === TAB_INDEXES.ENABLE_MULTI) {
      navigate(`/k8s/${lastNamespacePath}/${modelToRef(NetworkPolicyModel)}/enable-multi`);
      return;
    }

    navigate(
      `/k8s/${lastNamespacePath}/${activeTabKey === TAB_INDEXES.NETWORK ? modelToRef(NetworkPolicyModel) : modelToRef(MultiNetworkPolicyModel)}`,
    );
  }, [activeTabKey, lastNamespacePath, location.pathname, navigate]);

  const { t } = useNetworkingTranslation();

  return (
    <Tabs
      activeKey={activeTabKey}
      onSelect={(_, tabIndex: number | string) => {
        setActiveTabKey(tabIndex);
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
          <EnableMultiPage />
        </Tab>
      )}
    </Tabs>
  );
};

export default NetworkPolicyDetailsPage;
