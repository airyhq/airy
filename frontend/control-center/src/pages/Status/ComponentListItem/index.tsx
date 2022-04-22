import React, {useState, useEffect, useRef} from 'react';
import {ItemInfo} from './ItemInfo';
import styles from './index.module.scss';

type ComponentsListProps = {
  healthy: boolean;
  componentName: string;
  services: {name: string; healthy: boolean}[];
  enabled: boolean;
};

export const ComponentListItem = (props: ComponentsListProps) => {
  const {healthy, componentName, enabled, services} = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [wrapperHeight, setWrapperHeight] = useState('50Px');
  const wrapper = useRef(null);

  useEffect(() => {
    if (wrapper && wrapper.current) {
      if (isExpanded) {
        setWrapperHeight(`${wrapper.current.scrollHeight + 20}px`);
      } else {
        setWrapperHeight(`50px`);
      }
    }
  }, [isExpanded]);

  return (
    <section
      className={`${styles.wrapper} ${isExpanded ? styles.wrapperExpanded : ''}`}
      ref={wrapper} style={{height: wrapperHeight}}>
      <ItemInfo
        healthy={healthy}
        itemName={componentName}
        isComponent
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        enabled={enabled}
      />

      {services.map((service, index) => (
        <ItemInfo
          healthy={service.healthy}
          itemName={service.name}
          isComponent={false}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          key={index}
        />
      ))}
    </section>
  );
};
