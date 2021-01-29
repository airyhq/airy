import React from 'react';
import {connect} from 'react-redux';
import {Tag as TagModel} from 'httpclient';
import {Settings} from '../../reducers/data/settings';

import {ReactComponent as Close} from '../../assets/images/icons/close.svg';
import styles from './index.module.scss';
import {RootState} from '../../reducers';

type TagProps = {
  tag: TagModel;
  expanded?: boolean;
  onClick?: () => void;
  removeTag?: () => void;
  variant?: 'default' | 'light';
  type?: string;
};

type tagState = {
  settings: Settings;
};

export const Tag = ({tag, expanded, variant, onClick, removeTag, settings}: TagProps & tagState): JSX.Element => {
  const tagColor = (settings && settings.colors[tag.color]) || {
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
        className={`${styles.tagInner} ${onClick ? styles.clickable : ''} ${removeTag ? styles.isRemovable : ''}`}
        style={tagStyle()}>
        <span className={`${expanded === true ? styles.tagNameExpanded : styles.tagName}`}>{tag.name}</span>
        {removeTag && (
          <span className={styles.removeTag} onClick={removeTag}>
            <Close className={styles.closeButton} title="Delete" />
          </span>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    settings: state.data.settings,
  };
};

export default connect(mapStateToProps)(Tag);
