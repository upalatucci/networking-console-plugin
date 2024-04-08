import React, { FC } from 'react';

import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { getNamespace } from '@utils/resources/shared';
import { RouteTarget } from '@views/routes/details/utils/types';
import { calcTrafficPercentage } from '@views/routes/details/utils/utils';
import { RouteKind } from '@views/routes/list/utils/types';

type RouteTargetRowProps = {
  route: RouteKind;
  target: RouteTarget;
};

const RouteTargetRow: FC<RouteTargetRowProps> = ({ route, target }) => {
  return (
    <tr className="pf-v5-c-table__tr">
      <td className="pf-v5-c-table__td">
        <ResourceLink
          kind={target?.kind}
          name={target?.name}
          namespace={getNamespace(route)}
          title={target?.name}
        />
      </td>
      <td className="pf-v5-c-table__td">{target?.weight}</td>
      <td className="pf-v5-c-table__td">{calcTrafficPercentage(target?.weight, route)}</td>
    </tr>
  );
};

export default RouteTargetRow;
