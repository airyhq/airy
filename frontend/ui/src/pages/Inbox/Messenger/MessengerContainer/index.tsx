import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {StateModel} from '../../../../reducers';
import MessageList from '../MessageList';
import {ReactComponent as EmptyStateImage} from 'assets/images/empty-state/inbox-empty-state.svg';
import styles from './index.module.scss';
import ConversationMetadata from '../ConversationMetadata';
import ConversationHeader from '../ConversationHeader';
import MessageInput from '../../MessageInput';
import {allConversations, getConversation} from '../../../../selectors/conversations';
import {Source, Suggestions} from 'model';
import {getConversationInfo} from '../../../../actions';

const mapStateToProps = (state: StateModel, ownProps) => ({
  conversations: allConversations(state),
  currentConversation: getConversation(state, ownProps),
  config: state.data.config,
});

const mapDispatchToProps = {
  getConversationInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type MessengerContainerProps = ConnectedProps<typeof connector> & RouteComponentProps<{conversationId: string}>;

const MessengerContainer = ({
  conversations,
  currentConversation,
  getConversationInfo,
  match,
  config,
}: MessengerContainerProps) => {
  const [suggestions, showSuggestedReplies] = useState<Suggestions>(null);
  const [isFileDragged, setIsFileDragged] = useState(false);
  const [draggedAndDroppedFile, setDraggedAndDroppedFile] = useState<File | null>(null);
  const source = currentConversation?.channel?.source;
  const [dragAndDropDisabled, setDragAndDropDisabled] = useState(true);

  let dragCounter = 0;

  useEffect(() => {
    if (source && config) {
      if (
        config?.components['media-resolver']?.enabled &&
        (source === 'instagram' || source === 'facebook') &&
        !draggedAndDroppedFile
      ) {
        setDragAndDropDisabled(false);
      } else {
        setDragAndDropDisabled(true);
      }
    }
  }, [source, config, currentConversation?.id, draggedAndDroppedFile]);

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
    if (!currentConversation && match.params.conversationId) {
      getConversationInfo(match.params.conversationId);
    }

    setIsFileDragged(false);
    setDraggedAndDroppedFile(null);
  }, [currentConversation, match.params.conversationId]);

  const hideSuggestedReplies = () => {
    showSuggestedReplies(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (dragAndDropDisabled) return;
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    if (dragAndDropDisabled) return;

    event.preventDefault();
    event.stopPropagation();

    dragCounter++;

    setIsFileDragged(true);
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (dragAndDropDisabled) return;

    event.preventDefault();
    event.stopPropagation();

    dragCounter++;
    const file = event.dataTransfer.files[0];
    setDraggedAndDroppedFile(file);
    setIsFileDragged(false);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (dragAndDropDisabled) return;
    event.preventDefault();
    event.stopPropagation();

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
            <h1>Drop Files Here</h1>
          </div>
        )}

        {!conversations ? (
          <div className={styles.emptyState}>
            <h1>Your conversations will appear here as soon as a contact messages you.</h1>
            <p>Airy Messenger only shows new conversations from the moment you connect at least one channel.</p>
            <EmptyStateImage />
          </div>
        ) : (
          <div className={styles.messageDisplay}>
            {currentConversation && (
              <>
                <ConversationHeader />
                <MessageList showSuggestedReplies={showSuggestedReplies} />
                <MessageInput
                  suggestions={suggestions}
                  showSuggestedReplies={showSuggestedReplies}
                  hideSuggestedReplies={hideSuggestedReplies}
                  source={currentConversation.channel.source as Source}
                  draggedAndDroppedFile={draggedAndDroppedFile}
                  setDraggedAndDroppedFile={setDraggedAndDroppedFile}
                  setDragAndDropDisabled={setDragAndDropDisabled}
                />
              </>
            )}
          </div>
        )}
      </div>

      {currentConversation && <ConversationMetadata />}
    </>
  );
};

export default withRouter(connector(MessengerContainer));
