import React, {useEffect, useState} from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import {getTopicInfo} from '../../../../actions';
import {StateModel} from 'frontend/control-center/src/reducers';
import {connect, ConnectedProps} from 'react-redux';
import styles from './index.module.scss';

const mapDispatchToProps = {
  getTopicInfo,
};

const mapStateToProps = (state: StateModel) => {
  return {
    schemas: state.data.streams.schemas,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type TopicDescriptionProps = {
  topicName: string;
} & ConnectedProps<typeof connector>;

const formatJSON = (jsonString: string): string => {
  if (jsonString) {
    return JSON.stringify(JSON.parse(jsonString), null, 4);
  }
  return '';
};

const TopicDescription = (props: TopicDescriptionProps) => {
  const {topicName, schemas, getTopicInfo} = props;

  useEffect(() => {
    getTopicInfo(topicName);
  }, []);

  useEffect(() => {
    setCode(formatJSON(schemas[topicName] ? schemas[topicName].schema : ''));
  }, [schemas]);

  const [code, setCode] = useState(formatJSON(schemas[topicName] ? schemas[topicName].schema : ''));

  return (
    <div className={styles.container} onClick={e => e.stopPropagation()}>
      <CodeEditor
        value={code}
        language="json5"
        placeholder="Please enter Schema code."
        onChange={evn => setCode(evn.target.value)}
        padding={15}
        style={{
          height: '100%',
          fontSize: 12,
          backgroundColor: '#f5f5f5',
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
      />
    </div>
  );
};

export default connector(TopicDescription);
