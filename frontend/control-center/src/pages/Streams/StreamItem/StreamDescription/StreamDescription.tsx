import React, {useState} from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import styles from './index.module.scss';
import {Button, ErrorPopUp} from 'components';
import {useTranslation} from 'react-i18next';
import {formatJSON, isJSON} from '../../../../services';

type StreamDescriptionProps = {
  streamName: string;
  code: string;
  setCode: (code: string) => void;
  resetCode: () => void;
  hasBeenModified: boolean;
};

const StreamDescription = (props: StreamDescriptionProps) => {
  const {streamName, hasBeenModified, code, setCode, resetCode} = props;

  const [isEditMode, setIsEditMode] = useState(false);
  const [firstTabSelected, setFirstTabSelected] = useState(true);
  const [showErrorPopUp, setShowErrorPopUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {t} = useTranslation();

  const resetCodeAndEndEdition = () => {
    resetCode();
    setIsEditMode(false);
  };

  const SchemaSection = () => {
    return (
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
    );
  };

  const MessageSection = () => {
    return (
      <CodeEditor
        value={formatJSON(
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
        )}
        readOnly={true}
        language="json5"
        autoFocus={isEditMode}
        placeholder=""
        padding={15}
        style={{
          height: '100%',
          fontSize: 12,
          lineHeight: '20px',
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          backgroundColor: 'transparent',
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
                if (isJSON(code)) {
                  setIsEditMode(!isEditMode);
                  if (isEditMode && hasBeenModified) {
                  }
                } else {
                  setIsEditMode(true);
                  setErrorMessage('JSON Not Valid');
                  setShowErrorPopUp(true);
                  setTimeout(() => setShowErrorPopUp(false), 5000);
                }
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

export default StreamDescription;
