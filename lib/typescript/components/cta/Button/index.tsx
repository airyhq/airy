import React, {CSSProperties, ReactNode} from 'react';

import styles from './style.module.scss';

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
  children: ReactNode;
  onClick?: (event?) => void;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  styleVariant?: styleVariantType;
  style?: CSSProperties;
  className?: string;
  tabIndex?: any;
  dataCy?: string;
  buttonRef?: any;
};

export const Button = ({
  children,
  onClick,
  type,
  styleVariant,
  disabled,
  tabIndex,
  dataCy,
  style,
  className,
  buttonRef,
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
      ref={buttonRef ?? null}
      type={type || 'button'}
      style={style}
      disabled={disabled || false}
      className={`${styleFor(styleVariant)} ${className}`}
      onClick={onClick}
      tabIndex={tabIndex}
      data-cy={dataCy}
    >
      {children}
    </button>
  );
};
