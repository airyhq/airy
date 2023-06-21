import React, {useEffect, useState} from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import {Button, Tooltip} from 'components';
import {useTranslation} from 'react-i18next';
import {ReactComponent as ArrowRightIcon} from 'assets/images/icons/arrowRight.svg';
import {SchemasMode} from '..';
import styles from './index.module.scss';
import {SchemaField} from 'model/Streams';
import {formatJSON, getValuesFromSchema} from '../../../services';

type PhaseOneProps = {
  nameA: string;
  nameB: string;
  schemas: {};
  fieldsSelected: SchemaField[];
  setFieldsSelected: (fields: SchemaField[]) => void;
  setPhase: (phase: number) => void;
  setMode: (mode: SchemasMode) => void;
};

export const PhaseOne = (props: PhaseOneProps) => {
  const {nameA, nameB, schemas, fieldsSelected, setFieldsSelected, setPhase, setMode} = props;
  const {t} = useTranslation();

  useEffect(() => {
    if (nameA && nameB) {
      setCodeA(formatJSON(schemas[nameA] ? schemas[nameA].schema : '{}'));
      setCodeB(formatJSON(schemas[nameB] ? schemas[nameB].schema : '{}'));
    }
  }, [schemas]);

  const [codeA, setCodeA] = useState(formatJSON(schemas[nameA] ? schemas[nameA].schema : '{}'));
  const [codeB, setCodeB] = useState(formatJSON(schemas[nameB] ? schemas[nameB].schema : '{}'));
  const [inverted, setInverted] = useState(false);

  const selectField = (field: SchemaField) => {
    if (isSelected(field)) {
      setFieldsSelected([...fieldsSelected.filter((tempField: SchemaField) => tempField.name !== field.name)]);
    } else {
      setFieldsSelected([...fieldsSelected, field]);
    }
  };

  const isSelected = (field: {name: string}) => {
    return !!fieldsSelected.filter(tempField => tempField.name === field.name).length;
  };

  return (
    <>
      <div className={styles.container}>
        <div style={{placeItems: 'flex-end', display: 'flex', flexDirection: 'column', marginTop: '-32px'}}>
          <Button
            styleVariant="small"
            type="button"
            onClick={() => {
              setPhase(2);
            }}
            disabled={!fieldsSelected.length}
          >
            JOIN
          </Button>
          <Button
            styleVariant="link"
            type="button"
            onClick={() => {
              setMode(SchemasMode.list);
            }}
            style={{
              backgroundColor: 'transparent',
              padding: '0',
              width: '68px',
              justifyContent: 'center',
              margin: '2px 0 0 0',
            }}
          >
            {t('cancel')}
          </Button>
        </div>
        <div className={styles.codeArea}>
          <div className={styles.code}>
            <p>{!inverted ? nameA : nameB}</p>
            <div>
              {getValuesFromSchema(!inverted ? codeA : codeB).map(value => {
                return (
                  <div key={value + Math.random().toString()} className={styles.valueContainer}>
                    <div className={styles.valuesTitle}>
                      <input
                        type="checkbox"
                        checked={isSelected(value)}
                        onChange={() => {
                          selectField(value);
                        }}
                      />
                      <div>{value.name}</div>
                    </div>
                    <CodeEditor
                      value={formatJSON(JSON.stringify(value))}
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
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{marginTop: '12px', display: 'flex', flexDirection: 'column'}}>
            <Tooltip
              hoverElement={
                <Button
                  styleVariant="small"
                  type="button"
                  onClick={() => {
                    setInverted(!inverted);
                  }}
                  style={{
                    padding: '0',
                    margin: ' 0 0 0 8px',
                    width: '68px',
                    justifyContent: 'center',
                    marginTop: '0',
                  }}
                >
                  <ArrowRightIcon className={styles.arrowIcon} />
                  <ArrowRightIcon className={styles.arrowIcon} />
                  <ArrowRightIcon className={styles.arrowIcon} />
                </Button>
              }
              hoverElementHeight={30}
              hoverElementWidth={82}
              tooltipContent="Merge Priority"
              direction="right"
            />
          </div>
          <div className={styles.code}>
            <p>{!inverted ? nameB : nameA}</p>
            <div>
              {getValuesFromSchema(!inverted ? codeB : codeA).map(value => {
                return (
                  <div key={value + Math.random().toString()} className={styles.valueContainer}>
                    <div className={styles.valuesTitle}>
                      <input
                        type="checkbox"
                        checked={isSelected(value)}
                        onChange={() => {
                          selectField(value);
                        }}
                      />
                      <div>{value.name}</div>
                    </div>
                    <CodeEditor
                      value={formatJSON(JSON.stringify(value))}
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
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
