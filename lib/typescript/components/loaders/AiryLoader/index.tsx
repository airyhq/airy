import React from 'react';
import Lottie from 'react-lottie';
// import * as animationData from './data.json';
import animationData from './data.json';

type AiryLoaderProps = {
  height?: number;
  width?: number;
  loop?: boolean;
  autoplay?: boolean;
  position?: 'absolute' | 'relative';
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export const AiryLoader = (props: AiryLoaderProps) => {
  const {height, width, loop, autoplay, position, top, right, bottom, left} = props;
  const margin = 88;

  const defaultOptions = {
    loop: loop || true,
    autoplay: autoplay || true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div
      style={
        position === 'relative'
          ? {
              position: 'relative',
              left: left || `calc(50% - ${width / 2}px)`,
              top: top || `calc(50% - ${height / 2}px - ${margin}px)`,
              right: right,
              bottom: bottom,
              height: `${height}px`,
              width: `${width}px`,
            }
          : position === 'absolute'
          ? {
              position: 'absolute',
              left: `calc(50% - (${width / 2}px)`,
              top: `calc(50% - (${height / 2}px - ${margin}px`,
              right: right,
              bottom: bottom,
              height: `${height}px`,
              width: `${width}px`,
            }
          : {}
      }
    >
      <Lottie height={height || 180} width={width || 180} options={defaultOptions} />
    </div>
  );
};
