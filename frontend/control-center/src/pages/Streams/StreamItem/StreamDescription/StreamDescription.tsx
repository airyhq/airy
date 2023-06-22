import React, {MutableRefObject, useEffect, useState} from 'react';
import {getStreamInfo} from '../../../../actions';
import {connect, ConnectedProps} from 'react-redux';
import {calculateHeightOfCodeString} from '../../../../services';
import styles from './index.module.scss';
import {InfoSection} from './InfoSection';

const mapDispatchToProps = {
  getStreamInfo,
};

const connector = connect(null, mapDispatchToProps);

type StreamDescriptionProps = {
  streamName: string;
  code: string;
  wrapperSection: MutableRefObject<any>;
} & ConnectedProps<typeof connector>;

const StreamDescription = (props: StreamDescriptionProps) => {
  const {streamName, code, getStreamInfo, wrapperSection} = props;

  useEffect(() => {
    getStreamInfo(streamName);
  }, []);

  useEffect(() => {
    window.addEventListener('themeChanged', () => {
      const theme = localStorage.getItem('theme');
      setEditorMode(theme ? 'vs-dark' : 'vs');
    });
  }, []);

  const [editorMode, setEditorMode] = useState(localStorage.getItem('theme') === 'dark' ? 'vs-dark' : 'vs');

  useEffect(() => {
    recalculateContainerHeight(code);
  }, [code]);

  const recalculateContainerHeight = (code: string) => {
    const basicHeight = 50;
    const headerHeight = 32;
    if (wrapperSection && wrapperSection.current) {
      wrapperSection.current.style.height = `${calculateHeightOfCodeString(code) + headerHeight + basicHeight}px`;
    } else {
      wrapperSection.current.style.height = `${basicHeight}px`;
    }
  };

  return (
    <div className={styles.containerNoEdit} onClick={e => e.stopPropagation()}>
      {code && code !== '{}' && (
        <InfoSection code={code} editorMode={editorMode} recalculateContainerHeight={recalculateContainerHeight} />
      )}
    </div>
  );
};

export default connector(StreamDescription);
