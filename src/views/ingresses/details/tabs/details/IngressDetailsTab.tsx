import React, { FC } from 'react';

import { IoK8sApiNetworkingV1Ingress } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { Grid, GridItem, PageSection, PageSectionVariants, Title } from '@patternfly/react-core';
import Loading from '@utils/components/Loading/Loading';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import IngressDetailsSection from '@views/ingresses/details/tabs/details/components/IngressDetailsSection/IngressDetailsSection';

import IngressRulesSection from './components/IngressRulesSection/IngressRulesSection';

import './IngressDetailsTab.scss';

type IngressDetailsTabProps = {
  obj: IoK8sApiNetworkingV1Ingress;
};

const IngressDetailsTab: FC<IngressDetailsTabProps> = ({ obj: ingress }) => {
  const { t } = useNetworkingTranslation();

  if (!ingress) return <Loading />;

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Title className="ingress-details-tab__header" headingLevel="h2">
          {t('{{kind}} details', { kind: ingress?.kind })}
        </Title>
        <Grid span={6}>
          <GridItem>
            <IngressDetailsSection ingress={ingress} />
          </GridItem>
        </Grid>
      </PageSection>
      <PageSection variant={PageSectionVariants.light}>
        <IngressRulesSection ingress={ingress} />
      </PageSection>
    </>
  );
};

export default IngressDetailsTab;
