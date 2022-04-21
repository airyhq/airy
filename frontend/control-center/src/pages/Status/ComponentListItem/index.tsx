import React, {useState} from 'react';
import {ItemInfo} from './ItemInfo';
import styles from './index.module.scss';

type ComponentsListProps = {
  healthy: boolean;
  componentName: string;
  services: {name: string; healthy: boolean}[];
};

export const ComponentListItem = (props: ComponentsListProps) => {
  const {healthy, componentName, services} = props;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className={`${styles.wrapper} ${isExpanded ? styles.wrapperExpanded : styles.wrapperCollapsed}`}>
      <ItemInfo
        healthy={healthy}
        itemName={componentName}
        isComponent
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      {isExpanded && (
        <>
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
        </>
      )}
    </section>
  );
};
