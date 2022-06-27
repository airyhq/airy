import React, {CSSProperties, ReactNode, useRef} from 'react';

import styles from './style.module.scss';

type styleVariantType = 'extra-small' | 'small' | 'normal' | 'outline' | 'outline-big' | 'warning' | 'link' | 'text';
type ButtonProps = {
  children: ReactNode;
  onClick?: (event?) => void;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  styleVariant?: styleVariantType;
  style?: CSSProperties;
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
  buttonRef,
}: ButtonProps) => {
  const styleFor = (variant: styleVariantType) => {
    switch (variant) {
      case 'extra-small':
        return styles.extraSmallButton;
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
      className={styleFor(styleVariant)}
      onClick={onClick}
      tabIndex={tabIndex}
      data-cy={dataCy}
    >
      {children}
    </button>
  );
};
