import { Popover, PopoverPosition, PopoverProps } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import React, { FC } from 'react';

const PopoverHelpIcon: FC<PopoverProps> = ({ position = PopoverPosition.right, ...rest }) => {
  return (
    <Popover aria-label="Help" position={position} {...rest}>
      <HelpIcon />
    </Popover>
  );
};

export default PopoverHelpIcon;
