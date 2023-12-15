import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import MonacoEditor from '@uiw/react-monacoeditor';
import {calculateHeightOfCodeString, isJSON} from '../../../../../services';
import {useTranslation} from 'react-i18next';
import {Button, Dropdown} from 'components';
import {checkCompatibilityOfNewSchema, setSchemaSchema} from '../../../../../actions';
import {ConnectedProps, connect} from 'react-redux';
import styles from '../index.module.scss';

const mapDispatchToProps = {
  setSchemaSchema,
  checkCompatibilityOfNewSchema,
};

const connector = connect(null, mapDispatchToProps);

type SchemaSectionProps = {
  schemaName: string;
  code: string;
  setCode: (code: string) => void;
  isEditMode: boolean;
  setIsEditMode: (flag: boolean) => void;
  setFirstTabSelected: (flag: boolean) => void;
  editorMode: string;
  wrapperSection: MutableRefObject<any>;
  setErrorMessage: (error: string) => void;
  setShowErrorPopUp: (flag: boolean) => void;
  version: number;
  loadSchemaVersion: (version: string) => void;
  versions: string[];
} & ConnectedProps<typeof connector>;

const SchemaSection = (props: SchemaSectionProps) => {
  const {
    schemaName,
    code,
    setCode,
    isEditMode,
    setIsEditMode,
    setFirstTabSelected,
    editorMode,
    wrapperSection,
    checkCompatibilityOfNewSchema,
    setSchemaSchema,
    setErrorMessage,
    setShowErrorPopUp,
    version,
    loadSchemaVersion,
    versions,
  } = props;

  const [localCode, setLocalCode] = useState(code);
  const [hasBeenChanged, setHasBeenChanged] = useState(false);
  const codeRef = useRef(null);
  const {t} = useTranslation();

  useEffect(() => {
    setLocalCode(code);
    recalculateContainerHeight(code);
  }, [code]);

  const resetCodeAndEndEdition = () => {
    setLocalCode(code);
    setIsEditMode(!isEditMode);
  };

  const recalculateContainerHeight = (code: string) => {
    let basicHeight = 220;
    if (wrapperSection && wrapperSection.current) {
      wrapperSection.current.style.height = `${calculateHeightOfCodeString(code) + basicHeight}px`;
    } else {
      wrapperSection.current.style.height = `${basicHeight}px`;
    }
    if (!isEnrichmentAvailable(code)) {
      if ((wrapperSection.current.style.height.replace('px', '') as number) > 600) {
        wrapperSection.current.style.height = '600px';
      }
    } else {
      if ((wrapperSection.current.style.height.replace('px', '') as number) > 700) {
        wrapperSection.current.style.height = '700px';
      }
    }
  };

  const recalculateCodeHeight = (code: string) => {
    const codeHeight = calculateHeightOfCodeString(code);
    let height = 478;
    if (!isEnrichmentAvailable(code)) {
      height = 510;
    }
    if (codeHeight > height) {
      return height;
    }
    return codeHeight;
  };

  const isEnrichmentAvailable = (code: string): boolean => {
    let needsEnrichment = false;
    const parsedCode = JSON.parse(code);
    (parsedCode.fields || []).map(field => {
      if (typeof field.type === 'object' && !Array.isArray(field.type)) {
        if (!field.type.doc) {
          needsEnrichment = true;
        }
      } else if (!field.doc) {
        needsEnrichment = true;
      }
    });
    return needsEnrichment;
  };

  const checkCompatibility = (_schemaName: string, _code: string, _version: number) => {
    checkCompatibilityOfNewSchema(_schemaName, _code, _version)
      .then(() => {
        setSchemaSchema(_schemaName, _code)
          .then(() => {
            setCode(localCode);
            setHasBeenChanged(false);
          })
          .catch((e: string) => {
            setIsEditMode(true);
            setErrorMessage(e);
            setShowErrorPopUp(true);
            setTimeout(() => setShowErrorPopUp(false), 5000);
          });
      })
      .catch((e: string) => {
        if (e.includes('404')) {
          checkCompatibility(_schemaName + '-value', _code, _version);
        } else {
          setIsEditMode(true);
          setErrorMessage(e);
          setShowErrorPopUp(true);
          setTimeout(() => setShowErrorPopUp(false), 5000);
        }
      });
  };

  return (
    <>
      <div className={styles.buttonsContainer}>
        <div className={styles.leftButtonsContainer}>
          <button
            onClick={() => {
              setFirstTabSelected(true);
              recalculateContainerHeight(code);
            }}
          >
            Schema
          </button>
        </div>
        <div className={styles.version}>
          <p>version</p>
          <Dropdown
            text={version.toString()}
            variant="normal"
            options={versions}
            onClick={(option: string) => {
              loadSchemaVersion(option);
            }}
          />
        </div>
        <div className={styles.rightButtonsContainer}>
          <Button
            onClick={() => {
              setTimeout(() => {
                if (isJSON(code)) {
                  setIsEditMode(!isEditMode);
                  if (isEditMode && hasBeenChanged) {
                    checkCompatibility(schemaName, code, version);
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
          {hasBeenChanged && (
            <Button
              onClick={() => resetCodeAndEndEdition()}
              styleVariant="normal"
              style={{padding: '8px', margin: '4px', width: '50px', height: '24px', fontSize: 15, marginLeft: 4}}
            >
              {t('reset')}
            </Button>
          )}
        </div>
      </div>
      {isEnrichmentAvailable(code) && (
        <>
          <div>
            <div className={styles.enrichmentContainer}>
              <div className={styles.enrichmentText}>
                This schema can be automatically enriched with documentation and saved as a new version.
              </div>
              <Button
                onClick={() => setFirstTabSelected(false)}
                styleVariant="normal"
                style={{padding: '4px', margin: '4px', width: '170px', height: '32px', fontSize: 16, marginLeft: 4}}
              >
                Preview Changes
              </Button>
            </div>
            <div className={styles.enrichmentSchemaText}>Current schema: </div>
          </div>
        </>
      )}
      {code && code !== '{}' && (
        <MonacoEditor
          ref={codeRef}
          height={recalculateCodeHeight(code)}
          language="yaml"
          value={localCode}
          onChange={value => {
            if (value !== code) {
              setHasBeenChanged(true);
            } else {
              setHasBeenChanged(false);
            }
          }}
          onBlur={() => {
            setLocalCode(codeRef.current.editor.getModel().getValue());
          }}
          options={{
            scrollBeyondLastLine: isEditMode,
            readOnly: !isEditMode,
            theme: editorMode,
          }}
        />
      )}
    </>
  );
};

export default connector(SchemaSection);
