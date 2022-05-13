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
  const defaultHeight = 50;
  const serviceItemHeight = 24;

  useEffect(() => {
    if (wrapper && wrapper.current) {
      if (isExpanded) {
        wrapper.current.style.height = `${defaultHeight + services.length * (serviceItemHeight + paddingWrapper)}px`;
      } else {
        wrapper.current.style.height = `${defaultHeight}px`;
      }
    }
  }, [isExpanded]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section
      className={`${styles.wrapper} ${isExpanded ? styles.wrapperExpanded : ''}`}
      ref={wrapper}
      onClick={toggleExpanded}
    >
      <ItemInfo healthy={healthy} itemName={componentName} isComponent isExpanded={isExpanded} enabled={enabled} />

      {services.map((service, index) => (
        <ItemInfo
          healthy={service.healthy}
          itemName={service.name}
          isComponent={false}
          isExpanded={isExpanded}
          key={index}
        />
      ))}
    </section>
  );
};
