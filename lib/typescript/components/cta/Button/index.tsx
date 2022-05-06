import React, {CSSProperties, ReactNode} from 'react';

import styles from './style.module.scss';

type styleVariantType = 'small' | 'normal' | 'outline' | 'outline-big' | 'warning' | 'link' | 'text';
type ButtonProps = {
  children: ReactNode;
  onClick?: (event?) => void;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  styleVariant?: styleVariantType;
  style?: CSSProperties;
  tabIndex?: any;
  dataCy?: string;
};

export const Button = ({children, onClick, type, styleVariant, style, disabled, tabIndex, dataCy}: ButtonProps) => {
  const styleFor = (variant: styleVariantType) => {
    switch (variant) {
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
