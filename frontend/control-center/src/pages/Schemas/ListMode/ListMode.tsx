import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {ReactComponent as RefreshIcon} from 'assets/images/icons/refreshIcon.svg';
import {setPageTitle} from '../../../services/pageTitle';
import {AiryLoader} from 'components/loaders/AiryLoader';
import {StateModel} from '../../../reducers';
import {getSchemas} from '../../../actions';
import SchemaItem from '../SchemaItem';
import {getValidTopics} from '../../../selectors';
import {Button} from 'components';
import {useTranslation} from 'react-i18next';
import styles from '../index.module.scss';
import {SchemasMode} from '..';

const mapDispatchToProps = {
  getSchemas,
};

const mapStateToProps = (state: StateModel) => {
  return {
    schemas: getValidTopics(state),
  };
};

type ListModeProps = {
  selectedSchemas: string[];
  addSchemasToSelection: (schemaName: string) => void;
  setSelectedSchemas: (schemas: string[]) => void;
  mode: SchemasMode;
  setMode: (mode: SchemasMode) => void;
  setPopupEnabled: (value: boolean) => void;
} & ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps, mapDispatchToProps);

const ListMode = (props: ListModeProps) => {
  const {selectedSchemas, setSelectedSchemas, addSchemasToSelection, mode, setMode, setPopupEnabled} = props;
  const {schemas, getSchemas} = props;
  const [spinAnim, setSpinAnim] = useState(true);
  const [itemSelected, setItemSelected] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleString());
  const {t} = useTranslation();

  useEffect(() => {
    setPageTitle('Schemas');
    getSchemas()
      .then(() => {
        setLastRefresh(new Date().toLocaleString());
      })
      .catch((error: Error) => {
        console.error(error);
      });
  }, []);

  const handleRefresh = () => {
    props
      .getSchemas()
      .then(() => {
        setLastRefresh(new Date().toLocaleString());
      })
      .catch((error: Error) => {
        console.error(error);
      });
    setSpinAnim(!spinAnim);
  };

  return (
    <>
      <div className={styles.statusLastRefreshContainer}>
        <h1>{t('schemas')}</h1>
        <span>
          Last Refresh: <br />
          {lastRefresh}
        </span>
      </div>
      {Object.entries(schemas).length > 0 ? (
        <>
          <div className={styles.listHeader}>
            <h2>{t('name')}</h2>
            <Button
              className={`${mode === SchemasMode.select ? styles.listHeaderButtonConfirm : styles.listHeaderButton}`}
              styleVariant="green"
              onClick={() => {
                if (mode === SchemasMode.list) {
                  setPopupEnabled(true);
                } else {
                  setMode(SchemasMode.join);
                }
              }}
            >
              {mode === SchemasMode.select ? t('confirm').toLocaleUpperCase() : 'CREATE'}
            </Button>
            {mode === SchemasMode.select && (
              <Button
                className={styles.listHeaderButtonConfirm}
                styleVariant="warning"
                onClick={() => {
                  setMode(SchemasMode.list);
                  setSelectedSchemas([]);
                }}
              >
                {t('cancel').toLocaleUpperCase()}
              </Button>
            )}
            <button onClick={handleRefresh} className={styles.refreshButton}>
              <div className={spinAnim ? styles.spinAnimationIn : styles.spinAnimationOut}>
                <RefreshIcon />
              </div>
            </button>
          </div>
          <div className={styles.listItems}>
            {schemas.map(component => {
              return (
                <SchemaItem
                  key={component}
                  schemaName={component}
                  isJoinSelectionEnabled={mode === SchemasMode.select}
                  selectedSchemas={selectedSchemas}
                  addSchemasToSelection={addSchemasToSelection}
                  itemSelected={itemSelected}
                  setItemSelected={setItemSelected}
                />
              );
            })}
          </div>
        </>
      ) : (
        <AiryLoader height={240} width={240} position="relative" />
      )}
    </>
  );
};

export default connector(ListMode);
