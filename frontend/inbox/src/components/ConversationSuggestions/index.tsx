import React, {useEffect, useState} from 'react';
import {Conversation, Message} from 'model';
import styles from './index.module.scss';
import {ToolkitAI} from '../../services';
import {SimpleLoader} from 'components';
import {suggestReplies} from '../../actions/messages';
import {ConnectedProps, connect} from 'react-redux';

type ConversationSuggestionProps = {
  conversation: Conversation;
  messages: Message[];
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  suggestReplies,
};

const connector = connect(null, mapDispatchToProps);

let timeoutTopics: NodeJS.Timeout;
let timeoutSummary: NodeJS.Timeout;
let actionItemsSummary: NodeJS.Timeout;

const ConversationSuggestion = (props: ConversationSuggestionProps) => {
  const {conversation, messages, suggestReplies} = props;
  const toolkitAI = ToolkitAI.getInstance();
  const [topics, setTopics] = useState<string>();
  const [summary, setSummary] = useState<string>();
  const [actionItems, setActionItems] = useState<string>();
  const [topicsLoader, setTopicLoader] = useState<boolean>(true);
  const [summaryLoader, setSummaryLoader] = useState<boolean>(true);
  const [actionItemsLoader, setActionItemsLoader] = useState<boolean>(true);

  useEffect(() => {
    setTopicLoader(true);
    toolkitAI
      .askQuestion(
        `Analyse the messages of this conversation and give me the top 3 topics (no more than 50 characters per topic) of the conversation: ${JSON.stringify(
          messages
        )}`
      )
      .then((value: any) => {
        if (timeoutTopics) clearTimeout(timeoutTopics);
        setTopicLoader(true);
        setTopics(value.trim());
        timeoutTopics = setTimeout(() => {
          setTopicLoader(false);
        }, 1000);
      });
      return () => clearTimeout(timeoutTopics);
  }, [messages]);

  useEffect(() => {
    setSummaryLoader(true);    
    toolkitAI
      .askQuestion(
        `Analyse the messages of this conversation give me a summary of the outcome of the conversation (no more than 150 characters): ${JSON.stringify(
          messages
        )}`
      )
      .then((value: any) => {
        if (timeoutSummary) clearTimeout(timeoutSummary);
        setSummaryLoader(true);
        setSummary(value.trim());
        timeoutSummary = setTimeout(() => {
          setSummaryLoader(false);
        }, 1000);
      });
      return () => clearTimeout(timeoutSummary);
  }, [messages]);

  useEffect(() => {
    setActionItemsLoader(true);    
    toolkitAI
      .askQuestion(
        `Analyse the messages of this conversation give me a 3 actions items of this conversation (no more than 30 characters per item): ${JSON.stringify(
          messages
        )}`
      )
      .then((value: any) => {
        if (actionItemsSummary) clearTimeout(actionItemsSummary);
        setActionItemsLoader(true);
        setActionItems(value.trim());
        actionItemsSummary = setTimeout(() => {
          setActionItemsLoader(false);
        }, 1000);
      });
      return () => clearTimeout(actionItemsSummary);
  }, [messages]);

  useEffect(() => {
    toolkitAI
      .askQuestion(
        `Generate three suggested replies that make sense to this conversation (separate them by /). Keep in mind that we want to get all the info possible about the interested person, such as the company he or she works on, how can we help them and if they are interested in having a call with us. Also, don't add any title or numeration before each suggestion: ${JSON.stringify(
          messages
        )}`
      )
      .then((value: string) => {
        const suggestions = value.split('/');
        suggestReplies({
          message_id: conversation.lastMessage.id,
          suggestions: {
            'suggestion-1': {
              content: {
                text: suggestions[0].trim(),
              },
            },
            'suggestion-2': {
              content: {
                text: suggestions[1].trim(),
              },
            },
            'suggestion-3': {
              content: {
                text: suggestions[2].trim(),
              },
            },
          },
        });
      });
  }, [conversation.lastMessage.id]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Insights</h1>
      {topicsLoader ? (
        <SimpleLoader />
      ) : (
        <div className={styles.item}>
          <div className={styles.itemTitle}>Main Topics:</div>
          {topics}
        </div>
      )}
      {summaryLoader ? (
        <SimpleLoader />
      ) : (
        <div className={styles.item}>
          <div className={styles.itemTitle}>Summary:</div>
          {summary}
        </div>
      )}
      {actionItemsLoader ? (
        <SimpleLoader />
      ) : (
        <div className={styles.item}>
          <div className={styles.itemTitle}>Action Items:</div>
          {actionItems}
        </div>
      )}
    </div>
  );
};

export default connector(ConversationSuggestion);
