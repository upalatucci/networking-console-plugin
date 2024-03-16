import React, { FC } from 'react';

type MutedTextProps = { text: string };

const MutedText: FC<MutedTextProps> = ({ text }) => {
  return <div className="text-muted">{text}</div>;
};

export default MutedText;
