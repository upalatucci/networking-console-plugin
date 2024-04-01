import React, { FC } from 'react';

import { ServiceModel } from '@kubevirt-ui/kubevirt-api/console';
import { getGroupVersionKindForModel, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { IngressPathRule } from '@views/ingresses/details/tabs/details/utils/types';

type RulesRowProps = {
  namespace: string;
  rule: IngressPathRule;
};

const RulesRow: FC<RulesRowProps> = ({ namespace, rule }) => {
  return (
    <div className="row co-resource-list__item">
      <div className="col-xs-6 col-sm-4 col-md-2 co-break-word">
        <div>{rule?.host}</div>
      </div>
      <div className="col-xs-6 col-sm-4 col-md-2 co-break-word">
        <div>{rule?.path}</div>
      </div>
      <div className="col-md-3 hidden-sm hidden-xs co-break-word">
        <div>{rule?.pathType}</div>
      </div>
      <div className="col-sm-4 col-md-2 hidden-xs">
        {rule?.serviceName ? (
          <ResourceLink
            groupVersionKind={getGroupVersionKindForModel(ServiceModel)}
            name={rule?.serviceName}
            namespace={namespace}
          />
        ) : (
          '-'
        )}
      </div>
      <div className="col-xs-2 hidden-sm hidden-xs">
        <div>{rule?.servicePort || '-'}</div>
      </div>
    </div>
  );
};

export default RulesRow;
