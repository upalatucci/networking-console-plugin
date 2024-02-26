import { modelToGroupVersionKind } from '@kubevirt-ui/kubevirt-api/console/modelUtils';
import { NetworkAttachmentDefinitionModelRef } from '@kubevirt-ui/kubevirt-api/console/models/NetworkAttachmentDefinitionModel';
import {
  useActiveNamespace,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { QuickStart } from '@patternfly/quickstarts';
import {
  EmptyState,
  EmptyStateHeader,
  EmptyStateFooter,
  EmptyStateActions,
  Button,
} from '@patternfly/react-core';
import { ALL_NAMESPACES_KEY, DEFAULT_NAMESPACE } from '@utils/constants';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { QuickStartModel } from '@utils/models';
import React, { FC } from 'react';
import { useHistory } from 'react-router';
import { RocketIcon } from '@patternfly/react-icons/dist/esm/icons/rocket-icon';

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
      ({ spec: { displayName, description } }) =>
        displayName.toLowerCase().includes(searchText) ||
        description.toLowerCase().includes(searchText),
    );

  return (
    <EmptyState>
      <EmptyStateHeader
        titleText={<>{t('No network attachment definitions found')}</>}
        headingLevel="h4"
      />
      <EmptyStateFooter>
        <Button
          data-test-id="create-nad-empty"
          variant="primary"
          onClick={() =>
            history.push(
              `/k8s/ns/${
                namespace === ALL_NAMESPACES_KEY ? DEFAULT_NAMESPACE : namespace
              }/${NetworkAttachmentDefinitionModelRef}/~new/form`,
            )
          }
        >
          {t('Create network attachment definition')}
        </Button>
        {hasQuickStarts && (
          <EmptyStateActions>
            <Button
              data-test-id="nad-quickstart"
              variant="secondary"
              onClick={() =>
                history.push(
                  '/quickstart?keyword=network+attachment+definition',
                )
              }
            >
              <RocketIcon className="nad-quickstart-icon" />
              {t('Learn how to use network attachment definitions')}
            </Button>
          </EmptyStateActions>
        )}
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default NADListEmpty;
