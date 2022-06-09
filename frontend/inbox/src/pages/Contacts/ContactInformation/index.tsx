import {updateContactDetails, updateConversationContactInfo} from '../../../actions';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import styles from './index.module.scss';
import ContactDetails from '../../Inbox/Messenger/ConversationMetadata/ContactDetails';
import {useAnimation} from 'render';
import {Contact} from 'model';
import {Avatar} from 'components/message/Avatar';
import {Input} from 'components/inputs/Input';
import {ReactComponent as EditPencilIcon} from 'assets/images/icons/editPencil.svg';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';
import {ReactComponent as CheckmarkCircleIcon} from 'assets/images/icons/checkmark.svg';
import {ReactComponent as EditIcon} from 'assets/images/icons/pen.svg';
import {ReactComponent as CancelIcon} from 'assets/images/icons/cancelCross.svg';
import {StateModel} from '../../../reducers';
import {
  cyCancelEditContactIcon,
  cyDisplayName,
  cyDisplayNameInput,
  cyEditContactIcon,
  cyEditDisplayNameCheckmark,
  cyEditDisplayNameIcon,
} from 'handles';

const mapStateToProps = (state: StateModel) => ({
  contacts: state.data.contacts.all.items,
});

const mapDispatchToProps = {
  updateContactDetails,
  updateConversationContactInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ContactInformationProps = {
  contact: Contact;
  conversationId: string;
  editModeOn: boolean;
  cancelEdit: boolean;
  setEditModeOn: (editing: boolean) => void;
} & ConnectedProps<typeof connector>;

const ContactInformation = (props: ContactInformationProps) => {
  const {
    contact,
    contacts,
    conversationId,
    updateContactDetails,
    updateConversationContactInfo,
    editModeOn,
    cancelEdit,
    setEditModeOn,
  } = props;
  const {t} = useTranslation();
  const [showEditDisplayName, setShowEditDisplayName] = useState(false);
  const [displayName, setDisplayName] = useState(contact?.displayName);
  const [fade, setFade] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCanceled, setEditingCanceled] = useState(false);
  const [isContactDetailsExpanded, setIsContactDetailsExpanded] = useState(false);
  const [currentContactDisplayName, setCurrentContactDisplayName] = useState('');

  useEffect(() => {
    setCurrentContactDisplayName(contacts[contact?.id]?.displayName);
  }, [contacts, contact?.id]);

  useEffect(() => {
    setShowEditDisplayName(false);
    setDisplayName(contact?.displayName);
  }, [conversationId, contact?.id]);

  useEffect(() => {
    setIsEditing(editModeOn);
    cancelEdit && setEditingCanceled(true);
  }, [editModeOn, isContactDetailsExpanded, cancelEdit]);

  const saveEditDisplayName = () => {
    updateContactDetails({id: contact.id, displayName: displayName});

    if (contact?.conversations) {
      Object.keys(contact.conversations).forEach(conversationId => {
        updateConversationContactInfo(conversationId, displayName);
      });
    }

    setShowEditDisplayName(!saveEditDisplayName);
  };

  const cancelEditDisplayName = () => {
    setDisplayName(contact?.displayName);
    useAnimation(showEditDisplayName, setShowEditDisplayName, setFade, 400);
  };

  const editDisplayName = () => {
    setShowEditDisplayName(!showEditDisplayName);
  };

  const getUpdatedInfo = () => {
    setIsEditing(false);
    setEditModeOn(false);
  };

  const cancelContactsInfoEdit = () => {
    setEditingCanceled(true);
    setIsEditing(false);
    setEditModeOn(false);
  };

  const editContactDetails = () => {
    setEditingCanceled(false);
    setIsEditing(true);
  };

  const getIsExpanded = (isExpanded: boolean) => {
    setIsContactDetailsExpanded(isExpanded);
  };

  return (
    <>
      {(contact || conversationId) && (
        <div className={styles.content}>
          {!isEditing ? (
            <button
              className={`${styles.editIcon} ${isContactDetailsExpanded ? styles.iconBlue : styles.iconGrey}`}
              onClick={editContactDetails}
              data-cy={cyEditContactIcon}
            >
              <EditIcon aria-label="edit contact" />
            </button>
          ) : (
            <button
              className={`${styles.editIcon} ${styles.cancelIcon}`}
              onClick={cancelContactsInfoEdit}
              data-cy={cyCancelEditContactIcon}
            >
              <CancelIcon aria-label="cancel contact edit" />
            </button>
          )}

          <div className={styles.metaPanel}>
            <div className={styles.contact}>
              <div className={styles.avatarImage}>
                <Avatar contact={contact} />
              </div>
              <div className={styles.displayNameContainer}>
                {showEditDisplayName ? (
                  <div className={fade ? styles.fadeInAnimation : styles.fadeOutAnimation}>
                    <div className={styles.editDisplayNameContainer}>
                      <Input
                        autoFocus={true}
                        placeholder={displayName}
                        value={displayName}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDisplayName(event.target.value)}
                        height={32}
                        fontClass="font-base"
                        minLength={1}
                        maxLength={50}
                        label={t('setName')}
                        dataCy={cyDisplayNameInput}
                      />
                      <div className={styles.displayNameButtons}>
                        <button className={styles.cancelEdit} onClick={cancelEditDisplayName}>
                          <CloseIcon />
                        </button>
                        <button
                          className={`${displayName?.length === 0 ? styles.disabledSaveEdit : styles.saveEdit}`}
                          onClick={saveEditDisplayName}
                          disabled={displayName?.length === 0}
                          data-cy={cyEditDisplayNameCheckmark}
                        >
                          <CheckmarkCircleIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.displayName} data-cy={cyDisplayName}>
                    {currentContactDisplayName}
                    <EditPencilIcon
                      className={styles.editPencilIcon}
                      title={t('editDisplayName')}
                      onClick={editDisplayName}
                      data-cy={cyEditDisplayNameIcon}
                    />
                  </div>
                )}
              </div>
              <ContactDetails
                contact={contact}
                conversationId={conversationId}
                isEditing={isEditing}
                getUpdatedInfo={getUpdatedInfo}
                editingCanceled={editingCanceled}
                getIsExpanded={getIsExpanded}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default connector(ContactInformation);
