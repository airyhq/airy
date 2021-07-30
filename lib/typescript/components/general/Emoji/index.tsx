import React from 'react';

export type Props = {
  label?: string;
  className?: string;
  symbol: string;
};

export const Emoji = ({label, symbol, className}: Props) => (
  <span className={className || ''} role="img" aria-label={label ? label : ''} aria-hidden={label ? 'false' : 'true'}>
    {symbol}
  </span>
);
