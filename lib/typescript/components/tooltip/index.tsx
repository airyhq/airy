import React from 'react';
import styles from './index.module.scss';

type TooltipProps = {
  hoverElement: React.ReactNode;
  hoverElementHeight?: number;
  hoverElementWidth: number;
  tooltipContent: string;
};

export const Tooltip = (props: TooltipProps) => {
  const {hoverElement, hoverElementHeight, hoverElementWidth, tooltipContent} = props;

  return (
    <div className={styles.tooltipContainer} style={{marginLeft: `calc(50% - (${hoverElementWidth}px / 2)`}}>
      <div className={styles.hoverElement} style={{height: `${hoverElementHeight}px`}}>
        {hoverElement}
      </div>
      <span className={styles.tooltipContent}>{tooltipContent}</span>
    </div>
  );
};
