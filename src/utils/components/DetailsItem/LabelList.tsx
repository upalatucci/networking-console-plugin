import React, { FC } from 'react';
import { Link } from 'react-router-dom-v5-compat';
import classNames from 'classnames';
import * as _ from 'lodash-es';

import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk';
import { Label as PfLabel, LabelGroup as PfLabelGroup } from '@patternfly/react-core';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';

export type LabelProps = {
  expand: boolean;
  groupVersionKind: K8sGroupVersionKind;
  name: string;
  value: string;
};

export const Label: FC<LabelProps> = ({ expand, groupVersionKind, name, value }) => {
  const href = `/search?kind=${groupVersionKind.kind}&q=${
    value ? encodeURIComponent(`${name}=${value}`) : name
  }`;
  const kindOf = `co-m-${groupVersionKind.kind}`;
  const klass = classNames(kindOf, { 'co-m-expand': expand }, 'co-label');

  return (
    <>
      <PfLabel className={klass}>
        <Link className="pf-v5-c-label__content" to={href}>
          <span className="co-label__key" data-test="label-key">
            {name}
          </span>
          {value && <span className="co-label__eq">=</span>}
          {value && <span className="co-label__value">{value}</span>}
        </Link>
      </PfLabel>
    </>
  );
};

type LabelListProps = {
  expand?: boolean;
  groupVersionKind: K8sGroupVersionKind;
  labels: { [key: string]: string };
};

export const LabelList: FC<LabelListProps> = ({ expand = true, groupVersionKind, labels }) => {
  const { t } = useNetworkingTranslation();

  const list = _.map(labels, (label, key) => (
    <Label expand={expand} groupVersionKind={groupVersionKind} key={key} name={key} value={label} />
  ));

  return (
    <>
      {_.isEmpty(list) ? (
        <div className="text-muted" key="0">
          {t('No labels')}
        </div>
      ) : (
        <PfLabelGroup
          className="co-label-group"
          data-test="label-list"
          defaultIsOpen={true}
          numLabels={20}
        >
          {list}
        </PfLabelGroup>
      )}
    </>
  );
};
