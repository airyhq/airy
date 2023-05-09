import React, {useEffect, useState} from 'react';
import {getTopicInfo} from '../../../actions';
import {StateModel} from '../../../reducers';
import {connect, ConnectedProps} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {TopicsMode} from '..';
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
  getTopicInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type TopicInfoProps = {
  selectedTopics: string[];
  setMode: (mode: TopicsMode) => void;
  fromScratch: boolean;
} & ConnectedProps<typeof connector>;

const JoinMode = (props: TopicInfoProps) => {
  const {selectedTopics, schemas, fromScratch, getTopicInfo, setMode} = props;
  const {t} = useTranslation();

  useEffect(() => {
    if (selectedTopics.length === 2) {
      getTopicInfo(selectedTopics[0]);
      getTopicInfo(selectedTopics[1]);
    }
  }, [selectedTopics]);

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
        nameA={selectedTopics[0]}
        nameB={selectedTopics[1]}
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
        <h1>{t('streams')}</h1>
      </div>
      {getPhaseView()}
    </>
  );
};

export default connector(JoinMode);
