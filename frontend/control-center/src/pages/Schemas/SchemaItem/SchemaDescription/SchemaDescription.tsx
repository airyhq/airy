import React, {MutableRefObject, useEffect, useState} from 'react';
import {getSchemaInfo, getSchemaVersions} from '../../../../actions';
import {connect, ConnectedProps} from 'react-redux';
import {ErrorPopUp} from 'components';
import SchemaSection from './SchemaSection';
import styles from './index.module.scss';
import EnrichedSchemaSection from './EnrichedSchemaSection';

const mapDispatchToProps = {
  getSchemaInfo,
  getSchemaVersions,
};

const connector = connect(null, mapDispatchToProps);

type SchemaDescriptionProps = {
  schemaName: string;
  code: string;
  setCode: (code: string) => void;
  wrapperSection: MutableRefObject<any>;
  version: number;
  versions: string[];
} & ConnectedProps<typeof connector>;

const SchemaDescription = (props: SchemaDescriptionProps) => {
  const {schemaName, code, setCode, getSchemaInfo, getSchemaVersions, wrapperSection, version, versions} = props;

  useEffect(() => {
    getSchemaInfo(schemaName).catch(() => {
      getSchemaInfo(schemaName + '-value');
    });
    getSchemaVersions(schemaName);
  }, []);

  useEffect(() => {
    window.addEventListener('themeChanged', () => {
      const theme = localStorage.getItem('theme');
      setEditorMode(theme ? 'vs-dark' : 'vs');
    });
  }, []);

  const [isEditMode, setIsEditMode] = useState(false);
  const [firstTabSelected, setFirstTabSelected] = useState(true);
  const [showErrorPopUp, setShowErrorPopUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [editorMode, setEditorMode] = useState(localStorage.getItem('theme') === 'dark' ? 'vs-dark' : 'vs');

  const setNewSchemaCode = (text: string) => {
    setCode(text);
  };

  const loadSchemaVersion = (version: string) => {
    getSchemaInfo(schemaName, version).catch(() => {
      getSchemaInfo(schemaName + '-value', version);
    });
  };

  return (
    <div className={`${isEditMode ? styles.containerEdit : styles.containerNoEdit}`} onClick={e => e.stopPropagation()}>
      {firstTabSelected ? (
        <SchemaSection
          schemaName={schemaName}
          code={code}
          setCode={setNewSchemaCode}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          setFirstTabSelected={setFirstTabSelected}
          editorMode={editorMode}
          wrapperSection={wrapperSection}
          setErrorMessage={setErrorMessage}
          setShowErrorPopUp={setShowErrorPopUp}
          version={version}
          versions={versions}
          loadSchemaVersion={loadSchemaVersion}
        />
      ) : (
        <EnrichedSchemaSection
          schemaName={schemaName}
          code={code}
          setFirstTabSelected={setFirstTabSelected}
          editorMode={editorMode}
          wrapperSection={wrapperSection}
          setCode={setNewSchemaCode}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          setErrorMessage={setErrorMessage}
          setShowErrorPopUp={setShowErrorPopUp}
          version={version}
        />
      )}
      {showErrorPopUp && <ErrorPopUp message={errorMessage} closeHandler={() => setShowErrorPopUp(false)} />}
    </div>
  );
};

export default connector(SchemaDescription);
