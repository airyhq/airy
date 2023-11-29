import React, {MutableRefObject, useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import MonacoEditor from '@uiw/react-monacoeditor';
import {calculateHeightOfCodeString} from '../../../../services';
import styles from './index.module.scss';

const connector = connect(null, null);

type TopicDescriptionProps = {
  code: string;
  wrapperSection: MutableRefObject<any>;
} & ConnectedProps<typeof connector>;

const TopicDescription = (props: TopicDescriptionProps) => {
  const {code, wrapperSection} = props;

  useEffect(() => {
    window.addEventListener('themeChanged', () => {
      const theme = localStorage.getItem('theme');
      setEditorMode(theme ? 'vs-dark' : 'vs');
    });
  }, []);

  const [editorMode, setEditorMode] = useState(localStorage.getItem('theme') === 'dark' ? 'vs-dark' : 'vs');
  const [expanded, setExpanded] = useState(false);
  const jsonCode = code ? JSON.parse(code) : {};

  useEffect(() => {
    recalculateContainerHeight(code, expanded);
  }, [code]);

  const recalculateContainerHeight = (code: string, _expanded: boolean) => {
    const basicHeight = 160;
    const headerHeight = 32;
    if (!_expanded) {
      wrapperSection.current.style.height = `${basicHeight}px`;
    } else {
      if (wrapperSection && wrapperSection.current) {
        wrapperSection.current.style.height = `${calculateHeightOfCodeString(code) + 100 + headerHeight}px`;
      } else {
        wrapperSection.current.style.height = `${basicHeight}px`;
      }
    }
  };

  const calculateRetentionTime = (_jsonCode): string => {
    if (!_jsonCode) return 'Unknown';
    const config = _jsonCode['configs'];
    if (!config['retention.ms']) return 'Unknown';
    if (config['retention.ms'] === '-1') return 'Infinite';
    const ms = config['retention.ms'] as number;
    return `${(ms / 1000 / 60 / 60 / 24).toString()} day(s)`;
  };

  const calculateRetentionSize = (_jsonCode): string => {
    if (!_jsonCode) return 'Unknown';
    const config = _jsonCode['configs'];
    if (!config['retention.bytes']) return 'Unknown';
    if (config['retention.bytes'] === '-1') return 'Infinite';
    const bytes = config['retention.bytes'] as number;
    return `${(bytes / 1000).toString()}Mb`;
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
    recalculateContainerHeight(code, !expanded);
  };

  return (
    <div className={styles.containerNoEdit} onClick={e => e.stopPropagation()}>
      {code && code !== '{}' && (
        <>
          <div className={styles.topicInfoAttribute}>
            <div>Number of partitions: </div>
            <div>{jsonCode['partitions'].length}</div>
          </div>
          <div className={styles.topicInfoAttribute}>
            <div>Retention time: </div>
            <div>{calculateRetentionTime(jsonCode)}</div>
          </div>
          <div className={styles.topicInfoAttribute}>
            <div>Retention Size: </div>
            <div>{calculateRetentionSize(jsonCode)}</div>
          </div>
          <div className={styles.topicInfoLink} onClick={() => toggleExpanded()}>
            {expanded ? 'Close Config' : 'Open Config'}
          </div>
          {expanded && (
            <MonacoEditor
              height={calculateHeightOfCodeString(code)}
              language="yaml"
              value={code}
              options={{
                scrollBeyondLastLine: false,
                readOnly: true,
                theme: editorMode,
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default connector(TopicDescription);
