import React, { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';

import { modelToRef, NetworkPolicyModel } from '@kubevirt-ui/kubevirt-api/console';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import { useLastNamespacePath } from '@utils/hooks/useLastNamespacePath';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { MultiNetworkPolicyModel } from '@utils/models';

import MultiNetworkPolicyList from './MultiNetworkPolicyList';
import NetworkPolicyList from './NetworkPolicyList';

export type NetworkPolicyPageNavProps = {
  namespace: string;
};

const NetworkPolicyDetailsPage: FC<NetworkPolicyPageNavProps> = ({ namespace }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastNamespacePath = useLastNamespacePath();
  const [activeTabKey, setActiveTabKey] = useState<number | string>(
    location?.pathname.endsWith(MultiNetworkPolicyModel.kind) ? 1 : 0,
  );

  useEffect(() => {
    navigate(
      `/k8s/${lastNamespacePath}/${activeTabKey === 0 ? modelToRef(NetworkPolicyModel) : modelToRef(MultiNetworkPolicyModel)}`,
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
      <Tab eventKey={0} title={<TabTitleText>{t('NetworkPolicies')}</TabTitleText>}>
        <NetworkPolicyList namespace={namespace} />
      </Tab>
      <Tab eventKey={1} title={<TabTitleText>{t('MultiNetworkPolicies')}</TabTitleText>}>
        <MultiNetworkPolicyList namespace={namespace} />
      </Tab>
    </Tabs>
  );
};

export default NetworkPolicyDetailsPage;
