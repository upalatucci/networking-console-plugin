import React, { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';

import { K8sResourceCommon, ListPageHeader } from '@openshift-console/dynamic-plugin-sdk';
import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons';
import { isEmpty } from '@utils/utils';

import ExternalLink from '../ExternalLink/ExternalLink';
import Loading from '../Loading/Loading';

type ListEmptyStateProps<T> = {
  children: ReactNode;
  data: T[];
  href: string;
  kind: string;
  link: string;
  loaded: boolean;
  title: string;
};

const ListEmptyState = <T extends K8sResourceCommon>({
  children,
  data,
  href,
  kind,
  link,
  loaded,
  title,
}: ListEmptyStateProps<T>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();

  if (!loaded) return <Loading />;

  if (isEmpty(data))
    return (
      <>
        <ListPageHeader title={title} />
        <EmptyState>
          <EmptyStateHeader
            headingLevel="h4"
            icon={<EmptyStateIcon icon={AddCircleOIcon} />}
            titleText={t('No {{kind}} found', { kind })}
          />
          <EmptyStateBody>
            <Trans t={t}>
              Click <b>Create {{ kind }}</b> to to create your first {{ kind }}
            </Trans>
          </EmptyStateBody>
          <EmptyStateFooter>
            <EmptyStateActions>
              <Button
                onClick={() =>
                  navigate(params?.ns ? link : `/k8s/ns/default/${params.plural}/${link}`)
                }
                variant={ButtonVariant.primary}
              >
                {t('Create {{ kind }}', { kind })}
              </Button>
            </EmptyStateActions>
            <EmptyStateActions>
              <ExternalLink href={href}>{t('Learn more about {{ kind }}', { kind })}</ExternalLink>
            </EmptyStateActions>
          </EmptyStateFooter>
        </EmptyState>
      </>
    );

  return <>{children}</>;
};

export default ListEmptyState;
