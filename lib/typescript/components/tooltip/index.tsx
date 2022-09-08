import React from 'react';
import styles from './index.module.scss';

type TooltipProps = {
  hoverElement: React.ReactNode;
  hoverElementHeight?: number;
  hoverElementWidth: number;
  tooltipContent: string;
  direction: 'top' | 'right' | 'bottom' | 'left';
};

export const Tooltip = (props: TooltipProps) => {
  const {hoverElement, hoverElementHeight, hoverElementWidth, tooltipContent, direction} = props;

  return (
    <div
      className={`${styles.tooltipContainer} ${styles[direction]}`}
      style={{maxHeight: `${hoverElementHeight}px`, maxWidth: `${hoverElementWidth}px`}}
    >
      <div className={styles.hoverElement} style={{height: `${hoverElementHeight}px`}}>
        {hoverElement}
      </div>
      <span className={`${styles.tooltipContent} ${styles[direction]}`}>{tooltipContent}</span>
    </div>
  );
};
