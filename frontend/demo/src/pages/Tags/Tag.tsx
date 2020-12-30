import React from 'react';
import {connect} from 'react-redux';
import {Tag as TagModel } from 'httpclient';
import {TagSettings} from '../../types';

import close from '../../assets/images/icons/close.svg';
import styles from './Tag.module.scss';
import {RootState} from '../../reducers';

type TagProps = {
  tag: TagModel;
  expanded?: boolean;
  onClick?: () => void;
  removeTagFromContact?: () => void;
  variant?: 'default' | 'light';
  type?: string;
};

type tagState = {
  tagSettings: TagSettings;
};

export const Tag = ({
  tag,
  expanded,
  variant,
  onClick,
  removeTagFromContact,
  tagSettings,
}: TagProps & tagState): JSX.Element => {
  const tagColor = (tagSettings && tagSettings.colors[tag.color]) || {
    background: 'F1FAFF',
    border: '1578D4',
    default: '1578D4',
    font: '1578D4',
  };

  const tagStyle = () => {
    if (variant === 'light') {
      return {
        backgroundColor: `#${tagColor.background}`,
        color: `#${tagColor.font}`,
        border: `1px solid #${tagColor.border}`,
      };
    }

    return {backgroundColor: `#${tagColor.default}`};
  };

  return (
    <div className={styles.tag} onClick={onClick}>
      <div
        className={`${styles.tagInner} ${onClick ? styles.clickable : ''} ${
          removeTagFromContact ? styles.isRemovable : ''
        }`}
        style={tagStyle()}>
        <span className={`${expanded === true ? styles.tagNameExpanded : styles.tagName}`}>{tag.name}</span>
        {removeTagFromContact && (
          <span className={styles.removeTag} onClick={removeTagFromContact}>
            <img className={styles.closeButton} src={close} title="Delete" />
          </span>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    tagSettings: state.data.settings,
  };
};

export default connect(mapStateToProps)(Tag);
