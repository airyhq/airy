import React, {CSSProperties} from 'react';
import {ReactComponent as RefreshIcon} from 'assets/images/icons/refreshIcon.svg';

import styles from './index.module.scss';

type styleVariantType =
  | 'extra-small'
  | 'small'
  | 'normal'
  | 'outline'
  | 'outline-big'
  | 'warning'
  | 'link'
  | 'text'
  | 'green'
  | 'greenOutline'
  | 'purple'
  | 'purpleOutline';

type ButtonProps = {
  title: string;
  height: number;
  width: number;
  pending: boolean;
  onClick?: (event?) => void;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  styleVariant?: styleVariantType;
  className?: string;
  tabIndex?: any;
  dataCy?: string;
  buttonRef?: any;
  style?: CSSProperties;
};

export const SmartButton = ({
  title,
  pending,
  onClick,
  type,
  styleVariant,
  disabled,
  tabIndex,
  dataCy,
  className,
  buttonRef,
  style,
  height,
  width,
}: ButtonProps) => {
  const styleFor = (variant: styleVariantType) => {
    switch (variant) {
      case 'extra-small':
        return styles.extraSmallButton;
      case 'green':
        return styles.greenButton;
      case 'greenOutline':
        return styles.greenOutlineButton;
      case 'purple':
        return styles.purpleButton;
      case 'purpleOutline':
        return styles.purpleOutlineButton;
      case 'small':
        return styles.smallButton;
      case 'outline':
        return styles.outlineButton;
      case 'outline-big':
        return styles.outlineButtonBig;
      case 'warning':
        return styles.warningButton;
      case 'link':
        return styles.linkButton;
      case 'text':
        return styles.textButton;
      default:
        return styles.button;
    }
  };

  return (
    <button
      ref={buttonRef || null}
      type={type || 'button'}
      style={height && width ? {height: height, minWidth: width} : style}
      disabled={disabled || pending || false}
      className={`${styleFor(styleVariant)} ${className}`}
      onClick={onClick}
      tabIndex={tabIndex}
      data-cy={dataCy}
    >
      {pending ? (
        <div className={styles.spinAnimation}>
          <RefreshIcon height={height * 0.6} width={height * 0.6} />
        </div>
      ) : (
        title
      )}
    </button>
  );
};
