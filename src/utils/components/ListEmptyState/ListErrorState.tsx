import React, { FC } from 'react';
import { Trans } from 'react-i18next';

import { ListPageHeader } from '@openshift-console/dynamic-plugin-sdk';
import {
  Alert,
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
} from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { isEmpty } from '@utils/utils';

import restrictedSignImg from './restricted-sign.svg';

import './list-error-state.scss';

type ListErrorStateProps = {
  error: any;
  title: string;
};

const ListErrorState: FC<ListErrorStateProps> = ({ error, title }) => {
  const { t } = useNetworkingTranslation();

  if (error?.response?.status === 403)
    return (
      <>
        <ListPageHeader title={title} />
        <EmptyState className="list-error-state-root">
          <EmptyStateHeader
            headingLevel="h4"
            icon={<img src={restrictedSignImg} />}
            titleText={t('Restricted Access')}
          >
            {t("You don't have access to this section due to cluster policy.")}
          </EmptyStateHeader>
          <EmptyStateBody>
            {!isEmpty(error?.message) && (
              <Alert isInline title={t('Error details')} variant="danger">
                {error?.message}
              </Alert>
            )}
          </EmptyStateBody>
        </EmptyState>
      </>
    );

  return (
    <>
      <ListPageHeader title={title} />
      <EmptyState className="list-error-state-root">
        <EmptyStateBody>
          <span className="error-text-body">{error?.message}</span>
        </EmptyStateBody>
        <EmptyStateFooter>
          <EmptyStateActions>
            <Trans ns="plugin__networking-console-plugin" t={t}>
              Please{' '}
              <Button isInline onClick={() => location.reload()} variant={ButtonVariant.link}>
                try again
              </Button>
              .
            </Trans>
          </EmptyStateActions>
        </EmptyStateFooter>
      </EmptyState>
    </>
  );
};

export default ListErrorState;
