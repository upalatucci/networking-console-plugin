import React, { FC } from 'react';

import ActionsDropdown from '@utils/components/ActionsDropdown/ActionsDropdown';
import useRouteActions from '@views/routes/actions/hooks/useRouteActions';
import { RouteKind } from '@views/routes/list/utils/types';

type RouteActionsProps = {
  isKebabToggle?: boolean;
  route: RouteKind;
};

const RouteActions: FC<RouteActionsProps> = ({ isKebabToggle, route }) => {
  const [actions] = useRouteActions(route);

  return <ActionsDropdown actions={actions} id="route-actions" isKebabToggle={isKebabToggle} />;
};

export default RouteActions;
