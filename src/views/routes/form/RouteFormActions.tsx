import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom-v5-compat';

import { ActionGroup, Alert, AlertVariant, Button, ButtonVariant } from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { isEmpty } from '@utils/utils';

type RouteFormActionsProps = {
  apiError: Error;
};

const RouteFormActions: FC<RouteFormActionsProps> = ({ apiError }) => {
  const { t } = useNetworkingTranslation();
  const navigate = useNavigate();
  const {
    formState: { isSubmitting, isValid },
  } = useFormContext();

  return (
    <>
      {!isEmpty(apiError) && (
        <Alert isInline title={t('Error')} variant={AlertVariant.danger}>
          {apiError?.message}
        </Alert>
      )}
      <ActionGroup>
        <Button
          id="save-changes"
          isDisabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
          type="submit"
          variant={ButtonVariant.primary}
        >
          {t('Create')}
        </Button>
        <Button
          id="cancel"
          onClick={() => navigate(-1)}
          type="button"
          variant={ButtonVariant.secondary}
        >
          {t('Cancel')}
        </Button>
      </ActionGroup>
    </>
  );
};

export default RouteFormActions;
