import React, { FC } from 'react';
import { useHistory } from 'react-router';

import { NetworkAttachmentDefinitionModelRef } from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import { modelToGroupVersionKind } from '@kubevirt-ui/kubevirt-api/console/modelUtils';
import { useActiveNamespace, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { QuickStart } from '@patternfly/quickstarts';
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateFooter,
  EmptyStateHeader,
} from '@patternfly/react-core';
import { RocketIcon } from '@patternfly/react-icons/dist/esm/icons/rocket-icon';
import { ALL_NAMESPACES_KEY, DEFAULT_NAMESPACE } from '@utils/constants';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { QuickStartModel } from '@utils/models';

const NADListEmpty: FC = () => {
  const history = useHistory();
  const { t } = useNetworkingTranslation();
  const [namespace] = useActiveNamespace();

  const searchText = 'network attachment definition';
  const [quickStarts, quickStartsLoaded] = useK8sWatchResource<QuickStart[]>({
    groupVersionKind: modelToGroupVersionKind(QuickStartModel),
    isList: true,
  });
  const hasQuickStarts =
    quickStartsLoaded &&
    quickStarts.find(
      ({ spec: { description, displayName } }) =>
        displayName.toLowerCase().includes(searchText) ||
        description.toLowerCase().includes(searchText),
    );

  return (
    <EmptyState>
      <EmptyStateHeader
        headingLevel="h4"
        titleText={<>{t('No NetworkAttachmentDefinition found')}</>}
      />
      <EmptyStateFooter>
        <Button
          data-test-id="create-nad-empty"
          onClick={() =>
            history.push(
              `/k8s/ns/${
                namespace === ALL_NAMESPACES_KEY ? DEFAULT_NAMESPACE : namespace
              }/${NetworkAttachmentDefinitionModelRef}/~new/form`,
            )
          }
          variant="primary"
        >
          {t('Create NetworkAttachmentDefinition')}
        </Button>
        {hasQuickStarts && (
          <EmptyStateActions>
            <Button
              data-test-id="nad-quickstart"
              onClick={() => history.push('/quickstart?keyword=network+attachment+definition')}
              variant="secondary"
            >
              <RocketIcon className="nad-quickstart-icon" />
              {t('Learn how to use NetworkAttachmentDefinitions')}
            </Button>
          </EmptyStateActions>
        )}
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default NADListEmpty;
