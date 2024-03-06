import React, { FC } from 'react';
import * as _ from 'lodash';

import {
  Button,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { DetailsItem } from '@utils/components/DetailsItem/DetailsItem';
import {
  ResourceLink,
  Timestamp,
  getGroupVersionKindForResource,
  useAccessReview,
  useAnnotationsModal,
  useLabelsModal,
} from '@openshift-console/dynamic-plugin-sdk';
import { LabelList } from '@utils/components/DetailsItem/LabelList';
import { NetworkAttachmentDefinitionModelGroupVersionKind } from '@kubevirt-ui/kubevirt-api/console';
import { PencilAltIcon } from '@patternfly/react-icons';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { OwnerReferences } from '@utils/components/OwnerReference/owner-references';
import Loading from '@utils/components/Loading/Loading';
import { getConfigAsJSON, getType } from '@utils/resources/nads/selectors';
import { NetworkAttachmentDefinitionKind } from '@utils/resources/nads/types';
import { getBasicID, prefixedID } from './utils';

export const cnvBridgeNetworkType = 'cnv-bridge';
export const ovnKubernetesNetworkType = 'ovn-k8s-cni-overlay';
export const ovnKubernetesSecondaryLocalnet = 'ovn-k8s-cni-overlay-localnet';

const networkTypes = {
  sriov: 'SR-IOV',
  [cnvBridgeNetworkType]: 'CNV Linux bridge',
  [ovnKubernetesNetworkType]: 'OVN Kubernetes L2 overlay network',
  [ovnKubernetesSecondaryLocalnet]: 'OVN Kubernetes secondary localnet network',
};

type NADDetailsPageProps = {
  obj: NetworkAttachmentDefinitionKind;
};

const NADDetailsPage: FC<NADDetailsPageProps> = ({ obj: resource }) => {
  const { t } = useNetworkingTranslation();
  const metadata = resource?.metadata;
  const reference = getGroupVersionKindForResource(resource);
  const model = getK8sModel(reference);
  const annotationsModalLauncher = useAnnotationsModal(resource);
  const labelsModalLauncher = useLabelsModal(resource);
  const [canUpdate] = useAccessReview({
    group: model?.apiGroup,
    resource: model?.plural,
    verb: 'patch',
    name: metadata?.name,
    namespace: metadata?.namespace,
  });

  if (!resource)
    return (
      <PageSection>
        <Loading />
      </PageSection>
    );

  const type = getType(getConfigAsJSON(resource));
  const id = getBasicID(resource);
  return (
    <PageSection variant={PageSectionVariants.light}>
      <Title headingLevel="h2">
        {t('NetworkAttachmentDefinition details')}
      </Title>

      <div className="row">
        <div className="col-sm-6">
          <dl data-test-id="resource-summary" className="co-m-pane__details">
            <DetailsItem
              label={t('Name')}
              obj={resource}
              path={'metadata.name'}
            />
            {metadata?.namespace && (
              <DetailsItem
                label={t('Namespace')}
                obj={resource}
                path="metadata.namespace"
              >
                <ResourceLink
                  kind="Namespace"
                  name={metadata.namespace}
                  title={metadata.uid}
                  namespace={null}
                />
              </DetailsItem>
            )}
            <DetailsItem
              label={t('Labels')}
              obj={resource}
              path="metadata.labels"
              valueClassName="details-item__value--labels"
              onEdit={labelsModalLauncher}
              canEdit={canUpdate}
              editAsGroup
            >
              <LabelList
                groupVersionKind={
                  NetworkAttachmentDefinitionModelGroupVersionKind
                }
                labels={metadata?.labels}
              />
            </DetailsItem>
            <DetailsItem
              label={t('Annotations')}
              obj={resource}
              path="metadata.annotations"
            >
              {canUpdate ? (
                <Button
                  data-test="edit-annotations"
                  type="button"
                  isInline
                  onClick={annotationsModalLauncher}
                  variant="link"
                >
                  {t('{{count}} annotation', {
                    count: _.size(metadata?.annotations),
                  })}
                  <PencilAltIcon className="co-icon-space-l pf-v5-c-button-icon--plain" />
                </Button>
              ) : (
                t('{{count}} annotation', {
                  count: _.size(metadata?.annotations),
                })
              )}
            </DetailsItem>
            <DetailsItem
              label={t('Created at')}
              obj={resource}
              path="metadata.creationTimestamp"
            >
              <Timestamp timestamp={metadata?.creationTimestamp} />
            </DetailsItem>
            <DetailsItem
              label={t('Owner')}
              obj={resource}
              path="metadata.ownerReferences"
            >
              <OwnerReferences resource={resource} />
            </DetailsItem>
          </dl>
        </div>
        <div className="col-sm-6">
          <dl className="co-m-pane__details">
            <dt>{t('Type')}</dt>
            <dd id={prefixedID(id, 'type')}>
              {!type ? (
                <span className="text-secondary">Not available</span>
              ) : (
                _.get(networkTypes, [type], null) || type
              )}
            </dd>
          </dl>
        </div>
      </div>
    </PageSection>
  );
};

export default NADDetailsPage;
