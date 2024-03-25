import React, { FC, forwardRef, Ref, RefObject } from 'react';
import classNames from 'classnames';

type PrometheusGraphProps = {
  className?: string;
  ref?: Ref<HTMLDivElement>;
  title?: string;
};

const PrometheusGraph: FC<PrometheusGraphProps> = forwardRef(
  ({ children, className, title }, ref: RefObject<HTMLDivElement>) => (
    <div className={classNames('graph-wrapper graph-wrapper__horizontal-bar', className)} ref={ref}>
      {title && <h5 className="graph-title">{title}</h5>}
      {children}
    </div>
  ),
);

export default PrometheusGraph;
