import React from 'react';
import styles from './index.module.scss';
import Lottie from 'react-lottie';
import animationData from './spinnerLoader.json';

type InstallerLoaderProps = {
  children?: React.ReactNode;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  borderRadius?: number;
  installing: boolean;
  height?: number;
  width?: number;
  loop?: boolean;
  autoplay?: boolean;
};

export const InstallerLoader = (props: InstallerLoaderProps) => {
  const {
    children,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    borderRadius,
    installing,
    height,
    width,
    loop,
    autoplay,
  } = props;

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
      className={installing ? styles.containerInstalling : styles.container}
      style={{
        borderRadius: `${borderRadius}px`,
        marginTop: `${marginTop}px`,
        marginRight: `${marginRight}px`,
        marginBottom: `${marginBottom}px`,
        marginLeft: `${marginLeft}px`,
      }}
    >
      {installing && (
        <div className={styles.loaderInstalling}>
          <Lottie height={height || 60} width={width || 60} options={defaultOptions} />
        </div>
      )}
      {children}
    </div>
  );
};
