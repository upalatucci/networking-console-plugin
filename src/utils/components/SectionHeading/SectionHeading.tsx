import React from 'react';
import classNames from 'classnames';

export type SectionHeadingProps = {
  children?: any;
  id?: string;
  required?: boolean;
  style?: any;
  text: string;
};

const SectionHeading: React.SFC<SectionHeadingProps> = ({
  children,
  id,
  required,
  style,
  text,
}) => (
  <h2 className="co-section-heading" data-test-section-heading={text} id={id} style={style}>
    <span
      className={classNames({
        'co-required': required,
      })}
    >
      {text}
    </span>
    {children}
  </h2>
);

export default SectionHeading;
