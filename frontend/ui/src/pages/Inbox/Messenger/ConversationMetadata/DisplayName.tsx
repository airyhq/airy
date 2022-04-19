import React, {SetStateAction, useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {ReactComponent as CloseIcon} from 'assets/images/icons/close.svg';
import {ReactComponent as CheckmarkCircleIcon} from 'assets/images/icons/checkmark.svg';
import {useCurrentConversation} from '../../../../selectors/conversations';
import {cyDisplayNameInput, cyEditDisplayNameCheckmark} from 'handles';
import {updateConversationContactInfo} from '../../../../actions';
import {useAnimation} from '../../../../assets/animations';
import styles from './index.module.scss';
import {Input} from 'components';

const mapDispatchToProps = {updateConversationContactInfo};

const mapStateToProps = (state: any) => ({
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type DisplayNameProps = {
    setShowEditDisplayName: React.Dispatch<SetStateAction<boolean>>;
    showEditDisplayName: boolean;
  } & ConnectedProps<typeof connector>;

export const DisplayName = (props: DisplayNameProps) => {
  const {setShowEditDisplayName, showEditDisplayName, updateConversationContactInfo} = props;
  const conversation = useCurrentConversation();
  const [displayName, setDisplayName] = useState(conversation.metadata.contact.displayName);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setShowEditDisplayName(false);
    setDisplayName(conversation.metadata.contact.displayName);
  }, [conversation.id]);

  const saveEditDisplayName = () => {
    updateConversationContactInfo(conversation.id, displayName);
    setShowEditDisplayName(!saveEditDisplayName);
  };

  const cancelEditDisplayName = () => {
    setDisplayName(conversation.metadata.contact.displayName);
    useAnimation(setShowEditDisplayName, showEditDisplayName, setFade, 400);
  };

  return (
    <div className={fade ? styles.fadeInAnimation : styles.fadeOutAnimation}>
      <div className={styles.editDisplayNameContainer}>
        <Input
          autoFocus={true}
          placeholder={conversation.metadata.contact.displayName}
          value={displayName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDisplayName(event.target.value)}
          height={32}
          fontClass="font-base"
          minLength={1}
          maxLength={50}
          label="Set Name"
          dataCy={cyDisplayNameInput}
        />
        <div className={styles.displayNameButtons}>
          <button className={styles.cancelEdit} onClick={cancelEditDisplayName}>
            <CloseIcon />
          </button>
          <button
            className={`${displayName.length === 0 ? styles.disabledSaveEdit : styles.saveEdit}`}
            onClick={saveEditDisplayName}
            disabled={displayName.length === 0}
            data-cy={cyEditDisplayNameCheckmark}>
            <CheckmarkCircleIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
