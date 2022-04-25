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
  const wrapper = useRef(null);
  const paddingWrapper = 20;

  useEffect(() => {
    if (wrapper && wrapper.current) {
      if (isExpanded) {
        wrapper.current.style.height = `${wrapper.current.scrollHeight + paddingWrapper}px`;
      } else {
        wrapper.current.style.height = '50px';
      }
    }
  }, [isExpanded]);

  return (
    <section className={`${styles.wrapper} ${isExpanded ? styles.wrapperExpanded : ''}`} ref={wrapper}>
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
