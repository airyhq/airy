import React from 'react';
import styles from './index.module.scss';
import {ReactComponent as PlusCircleIcon} from 'assets/images/icons/plus-circle.svg';

type SourceTypeDescriptionCardProps = {
  image: JSX.Element;
  title: string;
  text: string;
  displayButton: boolean;
  id: string;
  onAddChannelClick?: () => void;
};

const SourceTypeDescriptionCard = (props: SourceTypeDescriptionCardProps) => {
  return (
    <>
      <div className={styles.requirementsDialogBackground}></div>
      <div className={styles.channelCard}>
        <div className={styles.channelLogo}>{props.image}</div>
        <div className={styles.channelTitleAndText}>
          <p className={styles.channelTitle}>{props.title}</p>
          <p className={styles.channelText}>{props.text}</p>
        </div>
      </div>

      {props.displayButton && (
        <div className={styles.channelButton}>
          <button type="button" className={styles.addChannelButton} onClick={props.onAddChannelClick}>
            <div className={styles.channelButtonIcon} title="Add a channel">
              <PlusCircleIcon />
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default SourceTypeDescriptionCard;
