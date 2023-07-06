import React, {useState} from 'react';
import {ReactComponent as TrashIcon} from 'assets/images/icons/trash.svg';
import {ReactComponent as ChevronDown} from 'assets/images/icons/chevronDown.svg';
import {Button, ListenOutsideClick} from 'components';
import {ConnectedProps, connect} from 'react-redux';
import {deleteSchema, getSchemas} from '../../../actions';
import styles from './index.module.scss';

type SchemaInfoProps = {
  schemaName: string;
  isJoinSelectionEnabled: boolean;
  selectedSchemas: string[];
  isSelected: boolean;
  addSchemasToSelection: (schemaName: string) => void;
  toggleExpanded: (item: string) => void;
  itemSelected: string;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  deleteSchema,
  getSchemas,
};

const connector = connect(null, mapDispatchToProps);

const SchemaInfo = (props: SchemaInfoProps) => {
  const {
    schemaName,
    isSelected,
    isJoinSelectionEnabled,
    selectedSchemas,
    addSchemasToSelection,
    toggleExpanded,
    itemSelected,
    deleteSchema,
    getSchemas,
  } = props;

  const [confirmDeletion, setConfirmDeletion] = useState(false);

  const deleteItem = () => {
    if (!confirmDeletion) {
      setConfirmDeletion(true);
    } else {
      setConfirmDeletion(false);
      deleteSchema(schemaName)
        .then(() => {
          getSchemas();
        })
        .catch(() => {
          deleteSchema(schemaName + '-value');
        });
    }
  };

  return (
    <div className={`${styles.container} ${itemSelected !== schemaName ? styles.expandedContainer : ''}`}>
      {isJoinSelectionEnabled ? (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            addSchemasToSelection(schemaName);
          }}
          disabled={selectedSchemas.length === 2 && !isSelected}
        />
      ) : (
        <ChevronDown
          className={`${styles.chevron} ${itemSelected === schemaName ? styles.chevronRotated : ''}`}
          onClick={() => toggleExpanded(schemaName)}
        />
      )}
      <div className={styles.name}>
        <p className={`${styles.componentName}`} onClick={() => toggleExpanded(schemaName)}>
          {schemaName}
        </p>
      </div>
      <div className={styles.info} onClick={() => toggleExpanded(schemaName)}>
        <div className={styles.blankSpace} />
        <p className={`${styles.infoComponent}`}>+info</p>
      </div>
      <div className={styles.delete} onClick={() => deleteItem()}>
        <div className={styles.blankSpace} />
        {confirmDeletion ? (
          <ListenOutsideClick onOuterClick={() => setConfirmDeletion(false)}>
            <Button styleVariant="small" type="button" onClick={() => deleteItem()}>
              Confirm?
            </Button>
          </ListenOutsideClick>
        ) : (
          <TrashIcon />
        )}
      </div>
    </div>
  );
};

export default connector(SchemaInfo);
