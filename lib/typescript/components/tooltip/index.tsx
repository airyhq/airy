import React from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './index.module.scss';

type TooltipProps = {
  hoverElement: React.ReactNode;
  hoverElementHeight?: number;
  hoverElementWidth: number;
  tooltipContent: string;
  direction: 'top' | 'right' | 'bottom' | 'left' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  position?: 'absolute' | 'relative';
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  navigateTo?: string;
  delay?: number; //in ms
};

export const Tooltip = (props: TooltipProps) => {
  const {
    hoverElement,
    hoverElementHeight,
    hoverElementWidth,
    tooltipContent,
    direction,
    position,
    navigateTo,
    top,
    right,
    bottom,
    left,
    delay,
  } = props;
  const navigate = useNavigate();
  const leftDirection = direction === 'bottomLeft' || direction === 'topLeft';
  const rightDirection = direction === 'bottomRight' || direction === 'topRight';
  const margin = hoverElementWidth + 5;

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
      <span
        className={`${styles.tooltipContent} ${styles[direction]}`}
        style={
          top && !position
            ? {
                top: `${top}px`,
                transition: `opacity ${delay}ms`,
                transitionDelay: `${delay}ms`,
                transitionDuration: `${delay}ms`,
              }
            : right && !position
            ? {
                right: `${right}px`,
                transition: `opacity ${delay}ms`,
                transitionDelay: `${delay}ms`,
                transitionDuration: `${delay}ms`,
              }
            : bottom && !position
            ? {
                bottom: `${bottom}px`,
                transition: `opacity ${delay}ms`,
                transitionDelay: `${delay}ms`,
                transitionDuration: `${delay}ms`,
              }
            : left && !position
            ? {
                left: `${left}px`,
                transition: `opacity ${delay}ms`,
                transitionDelay: `${delay}ms`,
                transitionDuration: `${delay}ms`,
              }
            : position === 'absolute'
            ? {
                position: 'absolute',
                top: `${top}px`,
                right: `${right}px`,
                bottom: `${bottom}px`,
                left: `${left}px`,
                transition: `opacity ${delay}ms`,
                transitionDelay: `${delay}ms`,
                transitionDuration: `${delay}ms`,
              }
            : position === 'relative'
            ? {
                position: 'relative',
                transition: `opacity ${delay}ms`,
                transitionDelay: `${delay}ms`,
                transitionDuration: `${delay}ms`,
              }
            : leftDirection
            ? {
                left: `${margin}px`,
                transition: `opacity ${delay}ms`,
                transitionDelay: `${delay}ms`,
                transitionDuration: `${delay}ms`,
              }
            : rightDirection
            ? {
                right: `${margin}px`,
                transition: `opacity ${delay}ms`,
                transitionDelay: `${delay}ms`,
                transitionDuration: `${delay}ms`,
              }
            : {transition: `opacity ${delay}ms`, transitionDelay: `${delay}ms`, transitionDuration: `${delay}ms`}
        }
      >
        {tooltipContent}
      </span>
    </div>
  );
};
