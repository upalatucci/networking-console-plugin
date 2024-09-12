import React, { FC } from 'react';
import { Helmet } from 'react-helmet';

import { PageSection, PageSectionVariants, Title } from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

import './error-page.scss';

type ErrorPageProps = {
  message: string;
  title?: string;
};

const ErrorPage: FC<ErrorPageProps> = ({ message, title }) => {
  const { t } = useNetworkingTranslation();

  return (
    <div>
      <Helmet>
        <title>{title || t('Error')}</title>
      </Helmet>
      <>
        <PageSection variant={PageSectionVariants.light}>
          <Title headingLevel="h2">{t('Error')}</Title>
        </PageSection>
        <PageSection className="networking-plugin-error-page" variant={PageSectionVariants.light}>
          {title && (
            <Title className="error-page-title" headingLevel="h2">
              {title}
            </Title>
          )}
          {message && <div className="pf-v5-u-text-align-center">{message}</div>}
        </PageSection>
      </>
    </div>
  );
};

export default ErrorPage;
