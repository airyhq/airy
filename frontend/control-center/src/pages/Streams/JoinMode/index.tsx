import React, {useEffect, useState} from 'react';
import {getTopicInfo} from '../../../actions';
import {StateModel} from 'frontend/control-center/src/reducers';
import {connect, ConnectedProps} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {StreamModes} from '..';
import {PhaseOne} from './PhaseOne';
import PhaseTwo from './PhaseTwo';
import styles from './index.module.scss';

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
  setMode: (mode: StreamModes) => void;
} & ConnectedProps<typeof connector>;

const JoinMode = (props: TopicInfoProps) => {
  const {selectedTopics, schemas, getTopicInfo, setMode} = props;
  const {t} = useTranslation();

  useEffect(() => {
    if (selectedTopics.length === 2) {
      getTopicInfo(selectedTopics[0]);
      getTopicInfo(selectedTopics[1]);
    }
  }, [selectedTopics]);

  const [finalCode, setFinalCode] = useState('{}');
  const [phase, setPhase] = useState(1);

  const getPhaseView = () => {
    if (phase === 2)
      return <PhaseTwo finalCode={finalCode} setFinalCode={setFinalCode} setPhase={setPhase} setMode={setMode} />;
    return (
      <PhaseOne
        nameA={selectedTopics[0]}
        nameB={selectedTopics[1]}
        schemas={schemas}
        setFinalCode={setFinalCode}
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
