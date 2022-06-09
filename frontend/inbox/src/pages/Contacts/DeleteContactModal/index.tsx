import {Button} from 'components/cta/Button';
import {deleteContact} from '../../../actions/contacts';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import styles from './index.module.scss';

const mapDispatchToProps = {
  deleteContact,
};

const connector = connect(null, mapDispatchToProps);

type DeleteContactModalProps = {
  id: string;
  setShowModal: (close: boolean) => void;
} & ConnectedProps<typeof connector>;

const DeleteContactModal = (props: DeleteContactModalProps) => {
  const {deleteContact, id, setShowModal} = props;
  const {t} = useTranslation();

  const handleDelete = () => {
    deleteContact(id);
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <h1>{t('deleteContact')}</h1>
      <p>{t('deleteContactText')}</p>
      <Button onClick={handleDelete} style={{maxWidth: '240px'}}>
        {t('confirm')}
      </Button>
    </div>
  );
};

export default connector(DeleteContactModal);
