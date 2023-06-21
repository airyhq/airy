import React, {useEffect, useState} from 'react';
import {setPageTitle} from '../../services/pageTitle';
import styles from './index.module.scss';
import JoinMode from './JoinMode';
import ListMode from './ListMode/ListMode';
import {ListenOutsideClick} from 'components';
import {ReactComponent as NewIcon} from 'assets/images/icons/new.svg';
import {ReactComponent as MergeIcon} from 'assets/images/icons/merge.svg';

export enum SchemasMode {
  list = 'list',
  select = 'select',
  join = 'join',
}

const Schemas = () => {
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [mode, setMode] = useState<SchemasMode>(SchemasMode.list);
  const [popupEnabled, setPopupEnabled] = useState(false);
  const [fromScratch, setFromScratch] = useState(false);

  useEffect(() => {
    setPageTitle('Schemas');
  }, []);

  const addSchemasToSelection = (schemaName: string) => {
    if (selectedSchemas.includes(schemaName)) {
      setSelectedSchemas(selectedSchemas.filter((schema: string) => schema !== schemaName));
    } else {
      setSelectedSchemas([...selectedSchemas, schemaName]);
    }
  };

  const PopUpSelector = () => {
    return (
      <div className={styles.popUpContainer}>
        <ListenOutsideClick onOuterClick={() => setPopupEnabled(false)}>
          <div className={styles.popUpView}>
            <div
              className={styles.popUpItems}
              onClick={() => {
                setFromScratch(true);
                setMode(SchemasMode.join);
                setPopupEnabled(false);
              }}
            >
              Create from scratch
              <NewIcon />
            </div>
            <div
              className={styles.popUpItems}
              onClick={() => {
                setFromScratch(false);
                setMode(SchemasMode.select);
                setPopupEnabled(false);
              }}
            >
              Create from existing schemas
              <MergeIcon />
            </div>
          </div>
        </ListenOutsideClick>
      </div>
    );
  };

  const getViewMode = () => {
    switch (mode) {
      case SchemasMode.list:
      case SchemasMode.select:
        return (
          <ListMode
            selectedSchemas={selectedSchemas}
            addSchemasToSelection={addSchemasToSelection}
            setSelectedSchemas={setSelectedSchemas}
            mode={mode}
            setMode={setMode}
            setPopupEnabled={setPopupEnabled}
          />
        );
      case SchemasMode.join:
        return <JoinMode selectedSchemas={selectedSchemas} setMode={setMode} fromScratch={fromScratch} />;
      default:
        return (
          <ListMode
            selectedSchemas={selectedSchemas}
            addSchemasToSelection={addSchemasToSelection}
            setSelectedSchemas={setSelectedSchemas}
            mode={mode}
            setMode={setMode}
            setPopupEnabled={setPopupEnabled}
          />
        );
    }
  };

  return (
    <>
      <section className={styles.statusWrapper}>{getViewMode()}</section>
      {popupEnabled && <PopUpSelector />}
    </>
  );
};

export default Schemas;
