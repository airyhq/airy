import React, {useEffect, useRef, useState} from 'react';
import MonacoEditor from '@uiw/react-monacoeditor';
import {calculateHeightOfCodeString, isJSON} from '../../../../../services';
import {useTranslation} from 'react-i18next';
import {Button} from 'components';
import styles from '../index.module.scss';
import {checkCompatibilityOfNewSchema, setTopicSchema} from '../../../../../actions';
import {ConnectedProps, connect} from 'react-redux';

const mapDispatchToProps = {
  setTopicSchema,
  checkCompatibilityOfNewSchema,
};

const connector = connect(null, mapDispatchToProps);

type SchemaSectionProps = {
  topicName: string;
  code: string;
  setCode: (code: string) => void;
  isEditMode: boolean;
  setIsEditMode: (flag: boolean) => void;
  setFirstTabSelected: (flag: boolean) => void;
  editorMode: string;
  recalculateContainerHeight: (text: string) => void;
  setErrorMessage: (error: string) => void;
  setShowErrorPopUp: (flag: boolean) => void;
  version: number;
} & ConnectedProps<typeof connector>;

const SchemaSection = (props: SchemaSectionProps) => {
  const {
    topicName,
    code,
    setCode,
    isEditMode,
    setIsEditMode,
    setFirstTabSelected,
    editorMode,
    recalculateContainerHeight,
    checkCompatibilityOfNewSchema,
    setTopicSchema,
    setErrorMessage,
    setShowErrorPopUp,
    version,
  } = props;

  const [localCode, setLocalCode] = useState(code);
  const [hasBeenChanged, setHasBeenChanged] = useState(false);
  const codeRef = useRef(null);
  const {t} = useTranslation();

  useEffect(() => {
    setLocalCode(code);
    recalculateContainerHeight(code);
  }, [code]);

  const resetCodeAndEndEdition = () => {
    setLocalCode(code);
    setIsEditMode(!isEditMode);
  };

  const checkCompatibility = (_topicName: string, _code: string, _version: number) => {
    checkCompatibilityOfNewSchema(_topicName, _code, _version)
      .then(() => {
        setTopicSchema(_topicName, _code)
          .then(() => {
            setCode(localCode);
            setHasBeenChanged(false);
          })
          .catch((e: string) => {
            setIsEditMode(true);
            setErrorMessage(e);
            setShowErrorPopUp(true);
            setTimeout(() => setShowErrorPopUp(false), 5000);
          });
      })
      .catch((e: string) => {
        if (e.includes('404')) {
          checkCompatibility(_topicName + '-value', _code, _version);
        } else {
          setIsEditMode(true);
          setErrorMessage(e);
          setShowErrorPopUp(true);
          setTimeout(() => setShowErrorPopUp(false), 5000);
        }
      });
  };

  return (
    <>
      <div className={styles.buttonsContainer}>
        <div className={styles.leftButtonsContainer}>
          <button
            onClick={() => {
              setFirstTabSelected(true);
              recalculateContainerHeight(code);
            }}
          >
            Schema
          </button>
          <button
            className={styles.tabNotSelected}
            onClick={() => {
              setFirstTabSelected(false);
            }}
          >
            Last Message
          </button>
        </div>
        <div className={styles.rightButtonsContainer}>
          <Button
            onClick={() => {
              setTimeout(() => {
                if (isJSON(code)) {
                  setIsEditMode(!isEditMode);
                  if (isEditMode && hasBeenChanged) {
                    checkCompatibility(topicName, code, version);
                  }
                } else {
                  setIsEditMode(true);
                  setErrorMessage('JSON Not Valid');
                  setShowErrorPopUp(true);
                  setTimeout(() => setShowErrorPopUp(false), 5000);
                }
              }, 200);
            }}
            styleVariant="normal"
            style={{padding: '8px', margin: '4px', width: '50px', height: '24px', fontSize: 15}}
          >
            {isEditMode ? t('save') : t('edit')}
          </Button>
          {hasBeenChanged && (
            <Button
              onClick={() => resetCodeAndEndEdition()}
              styleVariant="normal"
              style={{padding: '8px', margin: '4px', width: '50px', height: '24px', fontSize: 15, marginLeft: 4}}
            >
              {t('reset')}
            </Button>
          )}
        </div>
      </div>
      {code && code !== '{}' && (
        <MonacoEditor
          ref={codeRef}
          height={calculateHeightOfCodeString(code)}
          language="yaml"
          value={localCode}
          onChange={value => {
            if (value !== code) {
              setHasBeenChanged(true);
            } else {
              setHasBeenChanged(false);
            }
          }}
          onBlur={() => {
            setLocalCode(codeRef.current.editor.getModel().getValue());
          }}
          options={{
            scrollBeyondLastLine: isEditMode,
            readOnly: !isEditMode,
            theme: editorMode,
          }}
        />
      )}
    </>
  );
};

export default connector(SchemaSection);
