import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {StateModel} from '../../../../reducers';
import MessageList from '../MessageList';
import {ReactComponent as EmptyStateImage} from 'assets/images/emptyState/inboxEmptyState.svg';
import styles from './index.module.scss';
import ConversationMetadata from '../ConversationMetadata';
import ConversationHeader from '../ConversationHeader';
import MessageInput from '../../MessageInput';
import {allConversations, useCurrentConversation} from '../../../../selectors/conversations';
import {Source, Suggestions} from 'model';
import {getConversationInfo} from '../../../../actions';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const mapStateToProps = (state: StateModel) => ({
  conversations: allConversations(state),
  config: state.data.config,
});

const mapDispatchToProps = {
  getConversationInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type MessengerContainerProps = ConnectedProps<typeof connector>;

const MessengerContainer = ({conversations, getConversationInfo, config}: MessengerContainerProps) => {
  const {conversationId} = useParams();
  const {t} = useTranslation();
  const conversation = useCurrentConversation();
  const [suggestions, showSuggestedReplies] = useState<Suggestions>(null);
  const [isFileDragged, setIsFileDragged] = useState(false);
  const [draggedAndDroppedFile, setDraggedAndDroppedFile] = useState<File | null>(null);
  const source = conversation?.channel?.source;
  const [dragAndDropDisabled, setDragAndDropDisabled] = useState(true);

  let dragCounter = 0;

  useEffect(() => {
    if (source && config) {
      if (
        config?.components['media-resolver']?.enabled &&
        (source === 'instagram' ||
          source === 'facebook' ||
          source === 'google' ||
          source === 'twilio.whatsapp' ||
          source === 'chatplugin') &&
        !draggedAndDroppedFile
      ) {
        setDragAndDropDisabled(false);
      } else {
        setDragAndDropDisabled(true);
      }
    }
  }, [source, config, conversation?.id, draggedAndDroppedFile]);

  useEffect(() => {
    window.addEventListener(
      'dragover',
      event => {
        event.preventDefault();
        event.stopPropagation();
      },
      false
    );

    window.addEventListener(
      'drop',
      event => {
        event.preventDefault();
        event.stopPropagation();
      },
      false
    );
  }, [isFileDragged]);

  useEffect(() => {
    if (!conversation && conversationId) {
      getConversationInfo(conversationId);
    }

    setIsFileDragged(false);
    setDraggedAndDroppedFile(null);
  }, [conversation, conversationId]);

  const hideSuggestedReplies = () => {
    showSuggestedReplies(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (dragAndDropDisabled) return;
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (dragAndDropDisabled) return;

    dragCounter++;

    setIsFileDragged(true);
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (dragAndDropDisabled) return;

    dragCounter++;
    const file = event.dataTransfer.files[0];
    setDraggedAndDroppedFile(file);
    setIsFileDragged(false);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (dragAndDropDisabled) return;

    dragCounter--;
    if (dragCounter === 0) {
      setIsFileDragged(false);
    }
  };

  return (
    <>
      <div
        className={styles.wrapper}
        onDragEnter={e => handleDragEnter(e)}
        onDragOver={e => handleDragOver(e)}
        onDrop={e => handleFileDrop(e)}
        onDragLeave={e => handleDragLeave(e)}
        onMouseOut={() => setIsFileDragged(false)}
        onMouseLeave={() => setIsFileDragged(false)}
      >
        {!dragAndDropDisabled && (
          <div className={`${styles.dragContainer} ${isFileDragged ? styles.dragOverlay : styles.noDraggedFile}`}>
            <h1>{t('dropFilesHere')}</h1>
          </div>
        )}

        {!conversations ? (
          <div className={styles.emptyState}>
            <h1>{t('conversationsWillAppearHere')}</h1>
            <p>{t('conversationsWillAppearHereText')}</p>
            <EmptyStateImage />
          </div>
        ) : (
          <div className={styles.messageDisplay}>
            {conversation && (
              <>
                <ConversationHeader />
                <MessageList showSuggestedReplies={showSuggestedReplies} />
                <MessageInput
                  suggestions={suggestions}
                  showSuggestedReplies={showSuggestedReplies}
                  hideSuggestedReplies={hideSuggestedReplies}
                  source={conversation.channel.source as Source}
                  draggedAndDroppedFile={draggedAndDroppedFile}
                  setDraggedAndDroppedFile={setDraggedAndDroppedFile}
                  setDragAndDropDisabled={setDragAndDropDisabled}
                />
              </>
            )}
          </div>
        )}
      </div>

      {conversation && <ConversationMetadata />}
    </>
  );
};

export default connector(MessengerContainer);
