import React, { FC } from 'react';
import { Link } from 'react-router-dom-v5-compat';
import classNames from 'classnames';
import * as _ from 'lodash-es';
import {
  Label as PfLabel,
  LabelGroup as PfLabelGroup,
} from '@patternfly/react-core';

import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk';

export type LabelProps = {
  groupVersionKind: K8sGroupVersionKind;
  name: string;
  value: string;
  expand: boolean;
};

export const Label: FC<LabelProps> = ({
  groupVersionKind,
  name,
  value,
  expand,
}) => {
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
  labels: { [key: string]: string };
  groupVersionKind: K8sGroupVersionKind;
  expand?: boolean;
};

export const LabelList: FC<LabelListProps> = ({
  labels,
  groupVersionKind,
  expand = true,
}) => {
  const { t } = useNetworkingTranslation();

  const list = _.map(labels, (label, key) => (
    <Label
      key={key}
      groupVersionKind={groupVersionKind}
      name={key}
      value={label}
      expand={expand}
    />
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
          defaultIsOpen={true}
          numLabels={20}
          data-test="label-list"
        >
          {list}
        </PfLabelGroup>
      )}
    </>
  );
};
