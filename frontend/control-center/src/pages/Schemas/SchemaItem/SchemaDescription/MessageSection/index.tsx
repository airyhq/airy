import React from 'react';
import MonacoEditor from '@uiw/react-monacoeditor';
import {calculateHeightOfCodeString, formatJSON} from '../../../../../services';
import styles from '../index.module.scss';

type MessageSectionProps = {
  code: string;
  setFirstTabSelected: (flag: boolean) => void;
  editorMode: string;
  recalculateContainerHeight: (text: string) => void;
};

export const MessageSection = (props: MessageSectionProps) => {
  const {code, editorMode, setFirstTabSelected, recalculateContainerHeight} = props;

  return (
    <>
      <div className={styles.buttonsContainer}>
        <div className={styles.leftButtonsContainer}>
          <button
            className={styles.tabNotSelected}
            onClick={() => {
              setFirstTabSelected(true);
              recalculateContainerHeight(code);
            }}
          >
            Schema
          </button>
          <button
            onClick={() => {
              setFirstTabSelected(false);
            }}
          >
            Last Message
          </button>
        </div>
      </div>
      <MonacoEditor
        height={calculateHeightOfCodeString(lastMessageMock)}
        language="yaml"
        value={lastMessageMock}
        options={{
          scrollBeyondLastLine: false,
          readOnly: true,
          theme: editorMode,
        }}
      />
    </>
  );
};

export const lastMessageMock = formatJSON(
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
