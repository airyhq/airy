import React, {useState, useEffect, useRef, Dispatch, SetStateAction} from 'react';
import ItemInfo from './ItemInfo';
import styles from './index.module.scss';

type ComponentsListProps = {
  healthy: boolean;
  componentName: string;
  services: {name: string; healthy: boolean}[];
  enabled: boolean;
  index: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

export const ComponentListItem = (props: ComponentsListProps) => {
  const {healthy, componentName, enabled, services, index, loading, setLoading} = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const wrapperSection = useRef(null);
  const defaultHeight = 50;

  useEffect(() => {
    if (wrapperSection && wrapperSection.current) {
      if (isExpanded) {
        const val = defaultHeight + defaultHeight * services.length;
        wrapperSection.current.style.height = `${val}px`;
      } else {
        wrapperSection.current.style.height = `${defaultHeight}px`;
      }
    }
  }, [isExpanded]);

  const toggleExpanded = () => {
    if (!isPopUpOpen) setIsExpanded(!isExpanded);
    setCurrentIndex(index);
    props.setCurrentIndex(index);
    console.log('curren: ', currentIndex);
  };

  return (
    <section className={styles.wrapper} ref={wrapperSection} onClick={toggleExpanded}>
      <ItemInfo
        healthy={healthy}
        itemName={componentName}
        isComponent
        isExpanded={isExpanded}
        enabled={enabled}
        currentIndex={currentIndex}
        loading={loading}
        setLoading={setLoading}
        setIsPopUpOpen={setIsPopUpOpen}
      />

      {services.map((service, index) => (
        <ItemInfo
          enabled={enabled}
          healthy={service.healthy}
          itemName={service.name}
          isComponent={false}
          isExpanded={isExpanded}
          setIsPopUpOpen={setIsPopUpOpen}
          key={index}
        />
      ))}
    </section>
  );
};
