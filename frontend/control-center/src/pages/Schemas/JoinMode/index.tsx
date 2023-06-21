import React, {useEffect, useState} from 'react';
import {getSchemaInfo} from '../../../actions';
import {StateModel} from '../../../reducers';
import {connect, ConnectedProps} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {SchemasMode} from '..';
import {PhaseOne} from './PhaseOne';
import PhaseTwo from './PhaseTwo';
import styles from './index.module.scss';
import {SchemaField} from 'model/Streams';

const mapStateToProps = (state: StateModel) => {
  return {
    schemas: state.data.streams.schemas,
  };
};

const mapDispatchToProps = {
  getSchemaInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type TopicInfoProps = {
  selectedSchemas: string[];
  setMode: (mode: SchemasMode) => void;
  fromScratch: boolean;
} & ConnectedProps<typeof connector>;

const JoinMode = (props: TopicInfoProps) => {
  const {selectedSchemas, schemas, fromScratch, getSchemaInfo, setMode} = props;
  const {t} = useTranslation();

  useEffect(() => {
    if (selectedSchemas.length === 2) {
      getSchemaInfo(selectedSchemas[0]).catch(() => {
        getSchemaInfo(selectedSchemas[0] + '-value');
      });
      getSchemaInfo(selectedSchemas[1]).catch(() => {
        getSchemaInfo(selectedSchemas[1] + '-value');
      });
    }
  }, [selectedSchemas]);

  const [fieldsSelected, setFieldsSelected] = useState<SchemaField[]>([]);
  const [phase, setPhase] = useState(fromScratch ? 2 : 1);

  const getPhaseView = () => {
    if (phase === 2)
      return (
        <PhaseTwo
          fieldsSelected={fieldsSelected}
          setFieldsSelected={setFieldsSelected}
          setPhase={setPhase}
          setMode={setMode}
          fromScratch={fromScratch}
        />
      );
    return (
      <PhaseOne
        nameA={selectedSchemas[0]}
        nameB={selectedSchemas[1]}
        schemas={schemas}
        fieldsSelected={fieldsSelected}
        setFieldsSelected={setFieldsSelected}
        setPhase={setPhase}
        setMode={setMode}
      />
    );
  };

  return (
    <>
      <div className={styles.titleArea}>
        <h1>{t('schemas')}</h1>
      </div>
      {getPhaseView()}
    </>
  );
};

export default connector(JoinMode);
