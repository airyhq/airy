import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {setPageTitle} from '../../../services/pageTitle';
import {StateModel} from '../../../reducers';
import {getSchemas, getSchemaInfo, createStream} from '../../../actions';
import {Button, Dropdown, Input} from 'components';
import {useTranslation} from 'react-i18next';
import {getValidTopics} from '../../../selectors';
import CodeEditor from '@uiw/react-textarea-code-editor';
import {formatJSON} from '../../../services';

import styles from './index.module.scss';

const mapDispatchToProps = {
  getSchemas,
  getSchemaInfo,
  createStream,
};

const mapStateToProps = (state: StateModel) => {
  return {
    topics: getValidTopics(state),
    schemas: state.data.streams.schemas,
  };
};

type ListModeProps = {} & ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps, mapDispatchToProps);

const Creation = (props: ListModeProps) => {
  const {topics, schemas, getSchemas, getSchemaInfo, createStream} = props;

  const [topic1, setTopic1] = useState('');
  const [topic2, setTopic2] = useState('');
  const [selectedFieldsFirstTopic, setSelectedFieldsFirstTopic] = useState([]);
  const [selectedFieldsSecondTopic, setSelectedFieldsSecondTopic] = useState([]);
  const [selectedFieldsForJoins, setSelectedFieldsForJoins] = useState([]);
  const [currentJoinSelection1, setCurrentJoinSelection1] = useState();
  const [currentJoinSelection2, setCurrentJoinSelection2] = useState();
  const [currentJoinSelectionFieldName, setCurrentJoinSelectionFieldName] = useState('');
  const [savedFields, setSavedFields] = useState(false);
  const [streamName, setStreamName] = useState('');
  const [streamKey, setStreamKey] = useState('');

  const {t} = useTranslation();

  useEffect(() => {
    setPageTitle('Stream Creation');
    getSchemas();
  }, []);

  const getFieldsOfSchema = (topic: string): [] => {
    if (schemas[topic] && schemas[topic].schema) {
      const schema = schemas[topic].schema;
      const fields = JSON.parse(schema)['fields'];
      if (fields !== undefined) return fields;
    }
    return [];
  };

  const isSelected = (field, isFirst: boolean) => {
    if (isFirst) {
      return !!selectedFieldsFirstTopic.filter(_field => {
        return _field['name'] === field['name'];
      }).length;
    } else {
      return !!selectedFieldsSecondTopic.filter(_field => {
        return _field['name'] === field['name'];
      }).length;
    }
  };

  const selectedFieldFirstTopic = field => {
    if (isSelected(field, true)) {
      setSelectedFieldsFirstTopic(
        selectedFieldsFirstTopic.filter(_field => {
          return _field['name'] !== field['name'];
        })
      );
    } else {
      setSelectedFieldsFirstTopic([...selectedFieldsFirstTopic, field]);
    }
  };

  const selectedFieldSecondTopic = field => {
    if (isSelected(field, false)) {
      setSelectedFieldsSecondTopic(
        selectedFieldsSecondTopic.filter(_field => {
          return _field['name'] !== field['name'];
        })
      );
    } else {
      setSelectedFieldsSecondTopic([...selectedFieldsSecondTopic, field]);
    }
  };

  const addNewJoin = (name: string) => {
    const newJoin = {
      field1: currentJoinSelection1 ? currentJoinSelection1['name'] : 'undefined',
      field2: currentJoinSelection2 ? currentJoinSelection2['name'] : 'undefined',
      name,
    };
    setSelectedFieldsForJoins([...selectedFieldsForJoins, newJoin]);
    setCurrentJoinSelection1(undefined);
    setCurrentJoinSelection2(undefined);
    setCurrentJoinSelectionFieldName('');
  };

  const transformFieldsToPayloadFormat = (fields: {}[], topic: string) => {
    const formatedFields = [];
    fields.forEach(field => {
      formatedFields.push({
        name: field['name'],
        newName: field['name'] + '-' + topic,
      });
    });
    return formatedFields;
  };

  const createStreamPayload = () => {
    const payload = {
      name: streamName,
      aggregations: [],
      key: streamKey,
      topics: [
        {
          name: topic1,
          fields: transformFieldsToPayloadFormat(selectedFieldsFirstTopic, topic1),
        },
        {
          name: topic2,
          fields: transformFieldsToPayloadFormat(selectedFieldsSecondTopic, topic2),
        },
      ],
      joins: [...selectedFieldsForJoins],
    };
    createStream(payload);
  };

  return (
    <div className={styles.container}>
      <p className={styles.titleSection}>Select the two topics you want to join</p>
      <p className={styles.subtitleSection}>
        As you embark on the stream creation process, you&apos;ll be utilizing two Kafka topics. It&apos;s crucial to
        recognize that Topic 1 will assume the role of the persistent topic throughout the stream creation.
        Additionally, Topic 2 will contribute data to enrich and enhance the content of Topic 1.
      </p>
      <div className={styles.topicSelector}>
        <Dropdown
          text={topic1 !== '' ? topic1 : 'Topic 1'}
          variant="normal"
          options={topics}
          onClick={(topic: string) => {
            setTopic1(topic);
            getSchemaInfo(topic).catch(() => {
              getSchemaInfo(topic + '-value');
            });
          }}
        />
        <Dropdown
          text={topic2 !== '' ? topic2 : 'Topic 2'}
          variant="normal"
          options={topics}
          onClick={(topic: string) => {
            setTopic2(topic);
            getSchemaInfo(topic).catch(() => {
              getSchemaInfo(topic + '-value');
            });
          }}
        />
      </div>
      {topic1 !== '' && topic2 !== '' && (
        <>
          {!savedFields && (
            <>
              <p className={styles.titleSection}>Select the fields for the new topic</p>
              <p className={styles.subtitleSection}>
                A new topic will be generated by joining the two selected topics. It is now imperative to deliberate
                upon the specific fields you desire the new topic to inherit from its source topics.
              </p>
              <div className={styles.fieldsSection}>
                <div className={styles.codeSection}>
                  <p>{topic1}</p>
                  {getFieldsOfSchema(topic1).map(field => {
                    return (
                      <div
                        key={topic1 + (Math.random() + 1).toString(36).substring(7)}
                        className={`${styles.fieldCode} ${isSelected(field, true) ? styles.fieldCodeSelected : ''}`}
                        onClick={() => selectedFieldFirstTopic(field)}
                      >
                        <CodeEditor
                          value={formatJSON(JSON.stringify(field))}
                          language="json5"
                          placeholder=""
                          padding={15}
                          disabled={true}
                          style={{
                            height: '100%',
                            fontSize: 12,
                            lineHeight: '20px',
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                            backgroundColor: 'transparent',
                            border: '1px solid gray',
                            borderRadius: '10px',
                            pointerEvents: 'none',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className={styles.codeSection}>
                  <p>{topic2}</p>
                  {getFieldsOfSchema(topic2).map(field => {
                    return (
                      <div
                        key={topic2 + (Math.random() + 1).toString(36).substring(7)}
                        className={`${styles.fieldCode} ${isSelected(field, false) && styles.fieldCodeSelected}`}
                        onClick={() => selectedFieldSecondTopic(field)}
                      >
                        <CodeEditor
                          value={formatJSON(JSON.stringify(field))}
                          language="json5"
                          placeholder=""
                          padding={15}
                          disabled={true}
                          style={{
                            height: '100%',
                            fontSize: 12,
                            lineHeight: '20px',
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                            backgroundColor: 'transparent',
                            border: '1px solid gray',
                            borderRadius: '10px',
                            pointerEvents: 'none',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {!!selectedFieldsFirstTopic.length && !!selectedFieldsSecondTopic.length && !savedFields && (
            <div className={styles.saveButton}>
              <Button onClick={() => setSavedFields(true)} styleVariant="normal" type="button">
                {t('save')}
              </Button>
            </div>
          )}
          {savedFields && (
            <>
              <p className={styles.titleSection}>Selected fields for the new topic</p>
              <p className={styles.subtitleSection}>
                By joining the two selected topics, a new topic will be generated. The resulting new topic will comprise
                the following fields, which will be present in the merged dataset.
              </p>
              <div className={styles.fieldsSection}>
                <div className={styles.codeSection}>
                  <p>{topic1}</p>
                  {getFieldsOfSchema(topic1)
                    .filter(field => isSelected(field, true))
                    .map(field => {
                      return (
                        <div
                          key={topic1 + (Math.random() + 1).toString(36).substring(7)}
                          className={`${styles.fieldCode} ${isSelected(field, true) ? styles.fieldCodeSelected : ''}`}
                        >
                          <CodeEditor
                            value={formatJSON(JSON.stringify(field))}
                            language="json5"
                            placeholder=""
                            padding={15}
                            disabled={true}
                            style={{
                              height: '100%',
                              fontSize: 12,
                              lineHeight: '20px',
                              fontFamily:
                                'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                              backgroundColor: 'transparent',
                              border: '1px solid gray',
                              borderRadius: '10px',
                              pointerEvents: 'none',
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
                <div className={styles.codeSection}>
                  <p>{topic2}</p>
                  {getFieldsOfSchema(topic2)
                    .filter(field => isSelected(field, false))
                    .map(field => {
                      return (
                        <div
                          key={topic2 + (Math.random() + 1).toString(36).substring(7)}
                          className={`${styles.fieldCode} ${isSelected(field, false) && styles.fieldCodeSelected}`}
                        >
                          <CodeEditor
                            value={formatJSON(JSON.stringify(field))}
                            language="json5"
                            placeholder=""
                            padding={15}
                            disabled={true}
                            style={{
                              height: '100%',
                              fontSize: 12,
                              lineHeight: '20px',
                              fontFamily:
                                'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                              backgroundColor: 'transparent',
                              border: '1px solid gray',
                              borderRadius: '10px',
                              pointerEvents: 'none',
                            }}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
              {!!selectedFieldsForJoins.length && (
                <>
                  <p className={styles.titleSection}>Current condition to join event</p>
                  <p className={styles.subtitleSection}>
                    The existing condition sets the rule for determining when the data should be joined. It is
                    imperative that this condition is satisfied to enable the smooth flow of data through the stream and
                    facilitate the creation of new events in the new topic.
                  </p>
                  <div className={styles.joinsContainer}>
                    {selectedFieldsForJoins.map(joinObject => {
                      return (
                        <div
                          key={'joinObject' + (Math.random() + 1).toString(36).substring(7)}
                          className={styles.joinsSection}
                        >
                          <div className={styles.selectedJoinsSectionIf}>if</div>
                          <div className={styles.selectedJoinsSection}>
                            <div className={styles.selectedJoins}>{joinObject['field1']}</div>
                            <div className={styles.selectedJoinsEqual}>=</div>
                            <div className={styles.selectedJoins}>{joinObject['field2']}</div>
                          </div>
                          <div className={styles.selectedJoinsSectionIf}>then</div>
                          <div className={styles.selectedJoinsText}>JOIN EVENT</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {selectedFieldsForJoins.length < 1 && (
                <>
                  <p className={styles.titleSection}>Define conditions</p>
                  <p className={styles.subtitleSection}>
                    Please establish the condition that must be met for the data to be joined. For instance, specify the
                    criterion where Field 1 is equal to Field 2 (field1 = field2). This condition will serve as the
                    basis for merging the relevant data from both fields.
                  </p>
                  <div className={styles.selectFieldsJoinSection}>
                    <div className={styles.codeSection}>
                      <p>{topic1}</p>
                      {getFieldsOfSchema(topic1)
                        .filter(field => {
                          if (currentJoinSelection1) {
                            return field['name'] === currentJoinSelection1['name'];
                          }
                          return true;
                        })
                        .map(field => {
                          return (
                            <div
                              key={topic1 + (Math.random() + 1).toString(36).substring(7)}
                              className={styles.fieldCode}
                              onClick={() => {
                                if (currentJoinSelection1) {
                                  setCurrentJoinSelection1(undefined);
                                } else {
                                  setCurrentJoinSelection1(field);
                                }
                              }}
                            >
                              <CodeEditor
                                value={formatJSON(JSON.stringify(field))}
                                language="json5"
                                placeholder=""
                                padding={15}
                                disabled={true}
                                style={{
                                  height: '100%',
                                  fontSize: 12,
                                  lineHeight: '20px',
                                  fontFamily:
                                    'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                  backgroundColor: 'transparent',
                                  border: '1px solid gray',
                                  borderRadius: '10px',
                                  pointerEvents: 'none',
                                }}
                              />
                            </div>
                          );
                        })}
                    </div>
                    <div className={styles.codeSection}>
                      <p>{topic2}</p>
                      {getFieldsOfSchema(topic2)
                        .filter(field => {
                          if (currentJoinSelection2) {
                            return field['name'] === currentJoinSelection2['name'];
                          }
                          return true;
                        })
                        .map(field => {
                          return (
                            <div
                              key={topic2 + (Math.random() + 1).toString(36).substring(7)}
                              className={styles.fieldCode}
                              onClick={() => {
                                if (currentJoinSelection2) {
                                  setCurrentJoinSelection2(undefined);
                                } else {
                                  setCurrentJoinSelection2(field);
                                }
                              }}
                            >
                              <CodeEditor
                                value={formatJSON(JSON.stringify(field))}
                                language="json5"
                                placeholder=""
                                padding={15}
                                disabled={true}
                                style={{
                                  height: '100%',
                                  fontSize: 12,
                                  lineHeight: '20px',
                                  fontFamily:
                                    'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                  backgroundColor: 'transparent',
                                  border: '1px solid gray',
                                  borderRadius: '10px',
                                  pointerEvents: 'none',
                                }}
                              />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              )}
              {currentJoinSelection1 && currentJoinSelection2 && (
                <div className={styles.fieldNameSection}>
                  <Input
                    autoFocus={true}
                    type="text"
                    id="text"
                    label="Put a name to this join"
                    placeholder="Name of join"
                    value={currentJoinSelectionFieldName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setCurrentJoinSelectionFieldName(event.target.value)
                    }
                    required
                    height={32}
                    fontClass="font-base"
                  />
                  <Button onClick={() => addNewJoin(currentJoinSelectionFieldName)} styleVariant="small" type="button">
                    {t('add')}
                  </Button>
                </div>
              )}
            </>
          )}
          {!!selectedFieldsForJoins.length && (
            <div className={styles.inputsContainer}>
              <div className={styles.inputsSection}>
                <Input
                  autoFocus={false}
                  type="text"
                  id="text"
                  label="Name of the stream"
                  placeholder="MyStream"
                  value={streamName}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setStreamName(event.target.value)}
                  required
                  height={32}
                  fontClass="font-base"
                />
              </div>
              <div className={styles.inputsSection}>
                <Input
                  autoFocus={false}
                  type="text"
                  id="text"
                  label="Key of the stream"
                  placeholder="event.key"
                  value={streamKey}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setStreamKey(event.target.value)}
                  required
                  height={32}
                  fontClass="font-base"
                />
              </div>
              <Button onClick={() => createStreamPayload()} styleVariant="small" type="button">
                {t('create')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default connector(Creation);
