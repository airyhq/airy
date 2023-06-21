import React, {useState, useEffect, useRef} from 'react';
import SchemaInfo from './SchemaInfo';
import styles from './index.module.scss';
import {connect, ConnectedProps} from 'react-redux';
import {StateModel} from '../../../reducers';
import {formatJSON} from '../../../services';
import SchemaDescription from './SchemaDescription/SchemaDescription';

const mapStateToProps = (state: StateModel) => {
  return {
    schemas: state.data.streams.schemas,
  };
};

const connector = connect(mapStateToProps, null);

type SchemaItemProps = {
  schemaName: string;
  isJoinSelectionEnabled: boolean;
  selectedSchemas: string[];
  addSchemasToSelection: (schemaName: string) => void;
  itemSelected: string;
  setItemSelected: (item: string) => void;
} & ConnectedProps<typeof connector>;

const SchemaItem = (props: SchemaItemProps) => {
  const {
    schemaName,
    schemas,
    isJoinSelectionEnabled,
    selectedSchemas,
    addSchemasToSelection,
    itemSelected,
    setItemSelected,
  } = props;

  const [code, setCode] = useState(formatJSON(schemas[schemaName] ? schemas[schemaName].schema : '{}'));

  const wrapperSection = useRef(null);

  useEffect(() => {
    setCode(formatJSON(schemas[schemaName] ? schemas[schemaName].schema : '{}'));
  }, [schemas]);

  useEffect(() => {
    if (itemSelected !== schemaName) wrapperSection.current.style.height = `50px`;
  }, [itemSelected]);

  const toggleExpanded = (item: string) => {
    if (itemSelected === schemaName) {
      setItemSelected('');
    } else {
      setItemSelected(item);
    }
  };

  const getVersion = (): number => {
    if (schemas[schemaName]) return schemas[schemaName].version;
    return 1;
  };

  return (
    <section className={styles.wrapper} ref={wrapperSection}>
      <SchemaInfo
        schemaName={schemaName}
        isJoinSelectionEnabled={isJoinSelectionEnabled}
        selectedSchemas={selectedSchemas}
        addSchemasToSelection={addSchemasToSelection}
        isSelected={selectedSchemas.includes(schemaName)}
        toggleExpanded={toggleExpanded}
        itemSelected={itemSelected}
      />
      {itemSelected === schemaName && (
        <SchemaDescription
          schemaName={schemaName}
          code={code}
          setCode={setCode}
          wrapperSection={wrapperSection}
          version={getVersion()}
        />
      )}
    </section>
  );
};

export default connector(SchemaItem);
