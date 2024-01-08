import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import MonacoEditor from '@uiw/react-monacoeditor';
import {calculateHeightOfCodeString, isJSON} from '../../../../../services';
import {HttpClientInstance} from '../../../../../httpClient';
import styles from '../index.module.scss';
import {Button} from 'components';
import {ConnectedProps, connect} from 'react-redux';
import {checkCompatibilityOfNewSchema, setSchemaSchema} from '../../../../../actions';
import {useTranslation} from 'react-i18next';

type EnrichedSchemaSectionProps = {
  schemaName: string;
  code: string;
  setCode: (code: string) => void;
  setFirstTabSelected: (flag: boolean) => void;
  editorMode: string;
  wrapperSection: MutableRefObject<any>;
  isEditMode: boolean;
  setIsEditMode: (flag: boolean) => void;
  setErrorMessage: (error: string) => void;
  setShowErrorPopUp: (flag: boolean) => void;
  version: number;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  setSchemaSchema,
  checkCompatibilityOfNewSchema,
};

const connector = connect(null, mapDispatchToProps);

const EnrichedSchemaSection = (props: EnrichedSchemaSectionProps) => {
  const {
    schemaName,
    code,
    setCode,
    setFirstTabSelected,
    editorMode,
    wrapperSection,
    setSchemaSchema,
    isEditMode,
    setIsEditMode,
    checkCompatibilityOfNewSchema,
    setErrorMessage,
    setShowErrorPopUp,
    version,
  } = props;

  const [localCode, setLocalCode] = useState(undefined);
  const [hasBeenChanged, setHasBeenChanged] = useState(false);
  const codeRef = useRef(null);
  const {t} = useTranslation();

  useEffect(() => {
    if (isEnrichmentAvailable(code)) {
      setTimeout(() => {
        const enriched = localStorage.getItem(schemaName);
        if (enriched) {
          setLocalCode(enriched);
          recalculateContainerHeight(enriched);
        }
      }, 100);
      enrichCode(code);
    } else {
      wrapperSection.current.style.height = '156px';
    }
  }, [code]);

  const resetCodeAndEndEdition = () => {
    setIsEditMode(false);
    setFirstTabSelected(true);
  };

  const recalculateContainerHeight = (code: string) => {
    const basicHeight = 220;
    if (wrapperSection && wrapperSection.current) {
      wrapperSection.current.style.height = `${calculateHeightOfCodeString(code) + basicHeight}px`;
    } else {
      wrapperSection.current.style.height = `${basicHeight}px`;
    }
    if ((wrapperSection.current.style.height.replace('px', '') as number) > 700) {
      wrapperSection.current.style.height = '700px';
    }
  };

  const recalculateCodeHeight = (code: string) => {
    const codeHeight = calculateHeightOfCodeString(code);
    if (codeHeight > 478) {
      return 478;
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

  const enrichCode = async (code: string) => {
    let enrichedSchema = localStorage.getItem(schemaName);

    if (!enrichedSchema) {
      const enrichedCode = JSON.parse(code);

      // Use map to create an array of promises
      const promises = (enrichedCode.fields || []).map(async field => {
        console.log(typeof field.type);
        if (typeof field.type === 'object' && !Array.isArray(field.type)) {
          if (!field.type.doc) {
            const doc = await generateDocForField(field);
            field.type.doc = doc;
          }
        } else if (!field.doc) {
          const doc = await generateDocForField(field);
          field.doc = doc;
        }
      });

      // Wait for all promises to resolve
      await Promise.all(promises);

      enrichedSchema = JSON.stringify(enrichedCode, null, 2);
      localStorage.setItem(schemaName, enrichedSchema);
    }

    setLocalCode(enrichedSchema);
    recalculateContainerHeight(enrichedSchema);
  };

  const saveEnrichedSchema = () => {
    setSchemaSchema(schemaName, JSON.stringify(localCode, null, 2));
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

  const generateDocForField = async (field: any): Promise<string> => {
    try {
      const response = await HttpClientInstance.llmQuery({
        query: `This is the payload of a metadata field of a Kafka Schema ${JSON.stringify(
          field
        )}. A the name of the schema is ${schemaName}. This is the whole schema: ${code}. Give an accurante description of the field, so the users can understand what it is and what it is used for.`,
      });
      return response.answer.result;
    } catch (error) {
      console.error('Error in generateDocForField:', error);
      return '';
    }
  };

  return (
    <>
      <div className={styles.buttonsContainer}>
        <div className={styles.leftButtonsContainer}>
          <button
            className={styles.tabNotSelected}
            onClick={() => {
              setFirstTabSelected(true);
              setIsEditMode(false);
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
            Enrich Schema
          </button>
        </div>
      </div>
      {isEnrichmentAvailable(code) ? (
        <>
          <div>
            <div className={styles.enrichmentContainer}>
              <div className={styles.enrichmentText}>
                This schema can be automatically enriched with documentation and saved as a new version as follows.
              </div>
              <Button
                onClick={() => saveEnrichedSchema()}
                styleVariant="normal"
                style={{padding: '4px', margin: '4px', width: '180px', height: '32px', fontSize: 16, marginLeft: 4}}
              >
                Accept All Changes
              </Button>
            </div>
            <div className={styles.infoContainer}>
              <div className={styles.enrichmentSchemaText}>New schema: </div>
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
          </div>
          {localCode && localCode !== '{}' && (
            <div className={styles.codeContainer}>
              <MonacoEditor
                ref={codeRef}
                height={recalculateCodeHeight(localCode)}
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
            </div>
          )}
        </>
      ) : (
        <div>
          <div className={styles.enrichmentContainer}>
            <div className={styles.enrichmentText}>This schema has been enriched already with documentation.</div>
          </div>
        </div>
      )}
    </>
  );
};

export default connector(EnrichedSchemaSection);
