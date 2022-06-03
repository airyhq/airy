import React, {useState} from 'react';
import styles from './index.module.scss';

type ToolTipProps = {
  delay: number;
  children: React.ReactNode;
  direction: string;
  content: any;
};

export const Tooltip = (props: ToolTipProps) => {
  const {delay, children, direction, content} = props;
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay || 400);
  };

  const hideTip = () => {
    clearInterval(timeout);
    // setActive(false);
  };

  return (
    <div className={styles.toolTipWrapper} onMouseEnter={showTip} onMouseLeave={hideTip}>
      {children}
      {/* {active && <div className={`${styles.tooltip} ${direction}`}>{content}</div>} */}
      {active && <div className={`${styles.tooltip} 'bottom'`}>{content}</div>}
    </div>
  );
};
