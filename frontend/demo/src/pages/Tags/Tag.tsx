import React from 'react';
import {connect} from 'react-redux';
import {Tag as TagModel} from '../../model/Tag';

import close from '@airyhq/components/src/assets/images/icons/close.svg';
import styles from './Tag.module.scss';

type tagProps = {
  tag: TagModel;
  expanded?: boolean;
  onClick?: (event: any) => void;
  removeTagFromContact?: () => void;
  variant?: 'default' | 'light';
  type?: string;
};

type tagState = {
  tagSettings: any;
};

export const Tag = ({tag, expanded, variant, onClick, removeTagFromContact, tagSettings}: tagProps & tagState) => {
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

const mapStateToProps = state => {
  return {
    tagSettings: state.data.settings && state.data.settings.contact_tags,
  };
};

export default connect(mapStateToProps)(Tag);
