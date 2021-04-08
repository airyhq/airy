import React, {ReactNode} from 'react';

import styles from './style.module.scss';

export const Button = ({children, onClick, type, styleVariant, disabled, tabIndex, dataCy}: buttonProps) => {
  const styleFor = variant => {
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
      disabled={disabled || false}
      className={styleFor(styleVariant)}
      onClick={onClick}
      //@ts-ignore
      tabIndex={tabIndex}
      data-cy={dataCy}>
      {children}
    </button>
  );
};

type buttonProps = {
  /** button text */
  children: ReactNode;
  /** button clicked callback */
  onClick?: (event?) => void;
  /** the button type */
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  /** the button style variation */
  styleVariant?: 'small' | 'normal' | 'outline' | 'outline-big' | 'warning' | 'link' | 'text';
  tabIndex?: any;
  /** a handle for Cypress */
  dataCy?: string;
};
