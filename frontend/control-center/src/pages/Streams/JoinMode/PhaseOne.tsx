import React, {useEffect, useState} from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import {Button, ErrorPopUp} from 'components';
import {useTranslation} from 'react-i18next';
import {ReactComponent as ArrowRightIcon} from 'assets/images/icons/arrowRight.svg';
import {StreamModes} from '..';
import styles from './index.module.scss';

import {merge} from 'lodash-es';

type PhaseOneProps = {
  nameA: string;
  nameB: string;
  schemas: {};
  setFinalCode: (code: string) => void;
  setPhase: (phase: number) => void;
  setMode: (mode: StreamModes) => void;
};

export const PhaseOne = (props: PhaseOneProps) => {
  const {nameA, nameB, schemas, setFinalCode, setPhase, setMode} = props;
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
  const [showErrorPopUp, setShowErrorPopUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <>
      <div className={styles.container}>
        <div className={styles.codeArea}>
          <div className={styles.code}>
            <p>{!inverted ? nameA : nameB}</p>
            <CodeEditor
              value={!inverted ? codeA : codeB}
              language="json5"
              placeholder=""
              onChange={evn => {
                if (!inverted) {
                  setCodeA(evn.target.value);
                } else {
                  setCodeB(evn.target.value);
                }
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
          <div style={{marginTop: '-12px', display: 'flex', flexDirection: 'column'}}>
            <Button
              styleVariant="small"
              type="button"
              onClick={() => {
                try {
                  const jsonA = JSON.parse(codeA);
                  const jsonB = JSON.parse(codeB);
                  if (!inverted) {
                    setFinalCode(formatJSON(JSON.stringify(merge(jsonB, jsonA))));
                  } else {
                    setFinalCode(formatJSON(JSON.stringify(merge(jsonA, jsonB))));
                  }
                  setPhase(2);
                } catch (e) {
                  setErrorMessage(`JSON Not Valid: ${e.message}`);
                  setShowErrorPopUp(true);
                  setTimeout(() => {
                    setShowErrorPopUp(false);
                  }, 5000);
                }
              }}
            >
              JOIN
            </Button>
            <Button
              styleVariant="link"
              type="button"
              onClick={() => {
                setMode(StreamModes.select);
              }}
              style={{
                backgroundColor: 'transparent',
                padding: '0',
                width: '68px',
                justifyContent: 'center',
                marginTop: '0',
              }}
            >
              {t('cancel')}
            </Button>
            <p className={styles.mergeText}>Merge Priority</p>
            <Button
              styleVariant="small"
              type="button"
              onClick={() => {
                setInverted(!inverted);
              }}
              style={{
                padding: '0',
                width: '68px',
                justifyContent: 'center',
                marginTop: '0',
              }}
            >
              <ArrowRightIcon className={styles.arrowIcon} />
              <ArrowRightIcon className={styles.arrowIcon} />
              <ArrowRightIcon className={styles.arrowIcon} />
            </Button>
          </div>
          <div className={styles.code}>
            <p>{!inverted ? nameB : nameA}</p>
            <CodeEditor
              value={!inverted ? codeB : codeA}
              language="json5"
              placeholder=""
              onChange={evn => {
                if (!inverted) {
                  setCodeB(evn.target.value);
                } else {
                  setCodeA(evn.target.value);
                }
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

const formatJSON = (jsonString: string): string => {
  if (jsonString) {
    return JSON.stringify(JSON.parse(jsonString), null, 4);
  }
  return '';
};
