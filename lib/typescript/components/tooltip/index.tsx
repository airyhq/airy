import React from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './index.module.scss';

type TooltipProps = {
  hoverElement: React.ReactNode;
  hoverElementHeight?: number;
  hoverElementWidth: number;
  tooltipContent: string;
  direction: 'top' | 'right' | 'bottom' | 'left';
  navigateTo?: string;
};

export const Tooltip = (props: TooltipProps) => {
  const {hoverElement, hoverElementHeight, hoverElementWidth, tooltipContent, direction, navigateTo} = props;
  const navigate = useNavigate();

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    navigateTo && navigate(navigateTo, {state: {from: 'status'}});
  };

  return (
    <div
      className={`${styles.tooltipContainer} ${styles[direction]}`}
      style={{maxHeight: `${hoverElementHeight}px`, maxWidth: `${hoverElementWidth}px`}}
    >
      <div
        className={styles.hoverElement}
        style={{height: `${hoverElementHeight}px`}}
        onClick={event => handleOnClick(event)}
      >
        {hoverElement}
      </div>
      <span className={`${styles.tooltipContent} ${styles[direction]}`}>{tooltipContent}</span>
    </div>
  );
};
