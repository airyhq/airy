import React, {useEffect, useState} from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import {getTopicInfo, setTopicSchema, checkCompatibilityOfNewSchema} from '../../../../actions';
import {StateModel} from 'frontend/control-center/src/reducers';
import {connect, ConnectedProps} from 'react-redux';
import styles from './index.module.scss';
import {Button, ErrorPopUp} from 'components';
import {useTranslation} from 'react-i18next';

const mapDispatchToProps = {
  getTopicInfo,
  setTopicSchema,
  checkCompatibilityOfNewSchema,
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
  const {topicName, schemas, getTopicInfo, setTopicSchema, checkCompatibilityOfNewSchema} = props;

  useEffect(() => {
    getTopicInfo(topicName);
  }, []);

  useEffect(() => {
    setCode(formatJSON(schemas[topicName] ? schemas[topicName].schema : '{}'));
  }, [schemas]);

  const [code, setCode] = useState(formatJSON(schemas[topicName] ? schemas[topicName].schema : '{}'));
  const [isEditMode, setIsEditMode] = useState(false);
  const [showErrorPopUp, setShowErrorPopUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {t} = useTranslation();

  const resetCode = () => {
    setCode(formatJSON(schemas[topicName] ? schemas[topicName].schema : '{}'));
    setIsEditMode(false);
  };

  let hasBeenModified = false;
  if (schemas[topicName]) {
    hasBeenModified = formatJSON(schemas[topicName].schema) !== code;
  }

  return (
    <div className={`${isEditMode ? styles.containerEdit : styles.containerNoEdit}`} onClick={e => e.stopPropagation()}>
      <div className={styles.buttonsContainer}>
        <Button
          onClick={() => {
            setIsEditMode(!isEditMode);
            if (isEditMode && hasBeenModified) {
              checkCompatibilityOfNewSchema(topicName, code)
                .then(() => {
                  setTopicSchema(topicName, code).catch((e: string) => {
                    setIsEditMode(true);
                    setErrorMessage(e);
                    setShowErrorPopUp(true);
                    setTimeout(() => setShowErrorPopUp(false), 5000);
                  });
                })
                .catch((e: string) => {
                  setIsEditMode(true);
                  setErrorMessage(e);
                  setShowErrorPopUp(true);
                  setTimeout(() => setShowErrorPopUp(false), 5000);
                });
            }
          }}
          styleVariant="normal"
          style={{padding: '16px', width: '60px', height: '30px', fontSize: 16}}
        >
          {isEditMode ? t('save') : t('edit')}
        </Button>
        {hasBeenModified && (
          <Button
            onClick={() => resetCode()}
            styleVariant="normal"
            style={{padding: '16px', width: '60px', height: '30px', fontSize: 16, marginLeft: 8}}
          >
            {t('reset')}
          </Button>
        )}
      </div>
      <CodeEditor
        value={code}
        readOnly={!isEditMode}
        language="json5"
        autoFocus={isEditMode}
        placeholder=""
        onChange={evn => {
          if (isEditMode) setCode(evn.target.value);
        }}
        padding={15}
        style={{
          height: '100%',
          fontSize: 12,
          lineHeight: '20px',
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          backgroundColor: 'transparent',
        }}
      />
      {showErrorPopUp && <ErrorPopUp message={errorMessage} closeHandler={() => setShowErrorPopUp(false)} />}
    </div>
  );
};

export default connector(TopicDescription);
