import React, {useEffect, useState} from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import {Button, Input, ErrorPopUp} from 'components';
import {createTopic} from '../../../actions';
import {connect, ConnectedProps} from 'react-redux';
import styles from './index.module.scss';
import {TopicsMode} from '..';
import {SchemaField} from 'model/Streams';
import {formatJSON} from '../../../services';

type PhaseTwoProps = {
  fieldsSelected: SchemaField[];
  setFieldsSelected: (fields: SchemaField[]) => void;
  setPhase: (phase: number) => void;
  setMode: (mode: TopicsMode) => void;
  fromScratch: boolean;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  createTopic,
};

const connector = connect(null, mapDispatchToProps);

const PhaseTwo = (props: PhaseTwoProps) => {
  const {fieldsSelected, fromScratch, setPhase, createTopic, setMode} = props;

  const [aggregationKey, setAggregationKey] = useState('');
  const [topicName, setTopicName] = useState('');
  const [schemaName, setSchemaName] = useState('');
  const [schemaNamespace, setSchemaNamespace] = useState('');
  const [schemaType, setSchemaType] = useState('');
  const [showErrorPopUp, setShowErrorPopUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [finalCode, setFinalCode] = useState('');

  // useEffect(() => {
  //   try {
  //     const keys = getAllFieldNames(JSON.parse(finalCode));
  //     setSuggestions(keys);
  //   } catch {}
  // }, [finalCode]);

  useEffect(() => {
    const finalJSON = {
      fields: [...fieldsSelected],
      name: '',
      namespace: '',
      type: '',
    };
    setFinalCode(formatJSON(JSON.stringify(finalJSON)));
  }, [fieldsSelected]);

  const Suggestions = () => {
    return (
      <div className={styles.suggestionsContainer}>
        {suggestions
          .filter((suggestion: string) => {
            return suggestion.startsWith(aggregationKey);
          })
          .map((suggestion: string) => {
            return (
              <div
                key={suggestion}
                className={styles.suggestion}
                onClick={() => {
                  setAggregationKey(suggestion);
                }}
              >
                {suggestion}
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.codeArea}>
          <div className={styles.createTopicButtons}>
            <Input
              id="topicName"
              label="Topic Name"
              placeholder="Name..."
              tooltipText="Aggregation Key"
              value={topicName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTopicName(event.target.value)}
              height={32}
              autoComplete="off"
              fontClass="font-base"
            />
            <Input
              id="schemaName"
              label="Schema Name"
              placeholder="Schema Name..."
              tooltipText="Schema Name"
              value={schemaName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFinalCode(
                  formatJSON(
                    JSON.stringify({
                      ...JSON.parse(finalCode),
                      name: event.target.value,
                    })
                  )
                );
                setSchemaName(event.target.value);
              }}
              height={32}
              autoComplete="off"
              fontClass="font-base"
            />
            <Input
              id="schemaNamespace"
              label="Schema Namespace"
              placeholder="Schema Namespace..."
              tooltipText="Schema Namespace"
              value={schemaNamespace}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFinalCode(
                  formatJSON(
                    JSON.stringify({
                      ...JSON.parse(finalCode),
                      namespace: event.target.value,
                    })
                  )
                );
                setSchemaNamespace(event.target.value);
              }}
              height={32}
              autoComplete="off"
              fontClass="font-base"
            />
            <Input
              id="schemaType"
              label="Schema Type"
              placeholder="Type..."
              tooltipText="Schema Type"
              value={schemaType}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFinalCode(
                  formatJSON(
                    JSON.stringify({
                      ...JSON.parse(finalCode),
                      type: event.target.value,
                    })
                  )
                );
                setSchemaType(event.target.value);
              }}
              height={32}
              autoComplete="off"
              fontClass="font-base"
            />
            {/* <Input
              id="name"
              label="Aggregation Key"
              placeholder="userId, orderId, etc."
              tooltipText="Aggregation Key"
              value={aggregationKey}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAggregationKey(event.target.value)}
              height={32}
              autoComplete="off"
              fontClass="font-base"
            />
            {!!suggestions.length && !!aggregationKey.length && !suggestions.includes(aggregationKey) && (
              <Suggestions />
            )} */}
            <Button
              styleVariant="small"
              type="button"
              onClick={() => {
                createTopic(topicName, finalCode)
                  .then(() => {
                    setMode(TopicsMode.list);
                  })
                  .catch(e => {
                    setErrorMessage(e);
                    setShowErrorPopUp(true);
                    setTimeout(() => {
                      setShowErrorPopUp(false);
                    }, 5000);
                  });
              }}
            >
              CREATE TOPIC
            </Button>
            <Button
              styleVariant="link"
              type="button"
              onClick={() => {
                if (fromScratch) {
                  setMode(TopicsMode.list);
                }
                setPhase(1);
              }}
              style={{
                backgroundColor: 'transparent',
                padding: '0',
                width: '50px',
                justifyContent: 'center',
                marginTop: '0',
              }}
            >
              Cancel
            </Button>
          </div>
          <div className={styles.code}>
            <CodeEditor
              value={finalCode}
              language="json5"
              placeholder=""
              onChange={evn => {
                setFinalCode(evn.target.value);
              }}
              padding={15}
              style={{
                height: '100%',
                fontSize: 12,
                lineHeight: '20px',
                fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                backgroundColor: 'transparent',
                border: '1px solid gray',
                borderRadius: '10px',
              }}
            />
          </div>
        </div>
      </div>
      {showErrorPopUp && <ErrorPopUp message={errorMessage} closeHandler={() => setShowErrorPopUp(false)} />}
    </>
  );
};

export default connector(PhaseTwo);
