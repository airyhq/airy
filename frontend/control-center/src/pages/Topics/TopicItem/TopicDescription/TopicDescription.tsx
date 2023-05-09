import React, {useEffect, useState} from 'react';
import MonacoEditor from '@uiw/react-monacoeditor';
import {getTopicInfo, setTopicSchema, checkCompatibilityOfNewSchema} from '../../../../actions';
import {connect, ConnectedProps} from 'react-redux';
import styles from './index.module.scss';
import {Button, ErrorPopUp} from 'components';
import {useTranslation} from 'react-i18next';
import {calculateHeightOfCodeString, formatJSON, isJSON} from '../../../../services';

const mapDispatchToProps = {
  getTopicInfo,
  setTopicSchema,
  checkCompatibilityOfNewSchema,
};

const connector = connect(null, mapDispatchToProps);

type TopicDescriptionProps = {
  topicName: string;
  code: string;
  setCode: (code: string) => void;
  resetCode: () => void;
  hasBeenModified: boolean;
} & ConnectedProps<typeof connector>;

const TopicDescription = (props: TopicDescriptionProps) => {
  const {
    topicName,
    hasBeenModified,
    code,
    setCode,
    resetCode,
    getTopicInfo,
    setTopicSchema,
    checkCompatibilityOfNewSchema,
  } = props;

  useEffect(() => {
    getTopicInfo(topicName);
  }, []);

  useEffect(() => {
    window.addEventListener('themeChanged', () => {
      const theme = localStorage.getItem('theme');
      setEditorMode(theme ? 'vs-dark' : 'vs');
    });
  }, []);

  const [isEditMode, setIsEditMode] = useState(false);
  const [firstTabSelected, setFirstTabSelected] = useState(true);
  const [showErrorPopUp, setShowErrorPopUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [editorMode, setEditorMode] = useState(localStorage.getItem('theme') === 'dark' ? 'vs-dark' : 'vs');
  const {t} = useTranslation();

  const resetCodeAndEndEdition = () => {
    resetCode();
    setIsEditMode(false);
  };

  const SchemaSection = () => {
    let schemaCode = code;

    return (
      <MonacoEditor
        height={calculateHeightOfCodeString(code)}
        language="yaml"
        value={schemaCode}
        onChange={value => {
          if (isEditMode) schemaCode = value;
        }}
        onBlur={() => {
          setCode(schemaCode);
        }}
        options={{
          scrollBeyondLastLine: isEditMode,
          readOnly: !isEditMode,
          theme: editorMode,
        }}
      />
    );
  };

  const MessageSection = () => {
    const code = formatJSON(
      JSON.stringify({
        id: 'ad6b6f6b-7ae7-4607-a30f-0e6b6f7f6140',
        headers: {},
        isFromContact: false,
        deliveryState: 'DELIVERED',
        senderId: 'auth0:Aitor Algorta',
        sourceRecipientId: null,
        conversationId: '9bc34959-2993-41cd-9c49-de7d7bca91de',
        channelId: '91d30fe3-cf14-4045-9448-aea85549b316',
        source: 'chatplugin',
        content: '{"text":"496"}',
        sentAt: 1635499938550,
        updatedAt: 1635499938575,
      })
    );
    return (
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
    );
  };

  return (
    <div className={`${isEditMode ? styles.containerEdit : styles.containerNoEdit}`} onClick={e => e.stopPropagation()}>
      <div className={styles.buttonsContainer}>
        <div className={styles.leftButtonsContainer}>
          <button
            className={`${!firstTabSelected ? styles.tabNotSelected : ''}`}
            onClick={() => {
              setFirstTabSelected(true);
            }}
          >
            Schema
          </button>
          <button
            className={`${firstTabSelected ? styles.tabNotSelected : ''}`}
            onClick={() => {
              setFirstTabSelected(false);
            }}
          >
            Last Message
          </button>
        </div>
        {firstTabSelected && (
          <div className={styles.rightButtonsContainer}>
            <Button
              onClick={() => {
                setTimeout(() => {
                  if (isJSON(code)) {
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
            {hasBeenModified && (
              <Button
                onClick={() => resetCodeAndEndEdition()}
                styleVariant="normal"
                style={{padding: '8px', margin: '4px', width: '50px', height: '24px', fontSize: 15, marginLeft: 4}}
              >
                {t('reset')}
              </Button>
            )}
          </div>
        )}
      </div>
      {firstTabSelected ? <SchemaSection /> : <MessageSection />}
      {showErrorPopUp && <ErrorPopUp message={errorMessage} closeHandler={() => setShowErrorPopUp(false)} />}
    </div>
  );
};

export default connector(TopicDescription);
