import React from 'react';
import {connect, ConnectedProps} from 'react-redux';

import {Tag as TagModel} from 'model';

import {ReactComponent as Close} from 'assets/images/icons/close.svg';
import styles from './index.module.scss';
import {StateModel} from '../../reducers';

type TagProps = {
  tag: TagModel;
  expanded?: boolean;
  onClick?: () => void;
  removeTag?: () => void;
  variant?: 'default' | 'light';
} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => ({
  config: state.data.config,
});

const connector = connect(mapStateToProps, null);

const fallbackTagConfig = {
  background: 'F1FAFF',
  border: '1578D4',
  default: '1578D4',
  font: '1578D4',
};

export const Tag = ({tag, expanded, variant, onClick, removeTag, config: {tagConfig}}: TagProps): JSX.Element => {
  console.debug('tagConfig', tagConfig);
  console.debug('tag', tag);
  const tagColor = (tagConfig && tagConfig.colors[tag.color]) || fallbackTagConfig;

  const tagStyle =
    variant === 'light'
      ? {
          backgroundColor: `#${tagColor.background}`,
          color: `#${tagColor.font}`,
          border: `1px solid #${tagColor.border}`,
        }
      : {backgroundColor: `#${tagColor.default}`};

  return (
    <div className={styles.tag} onClick={onClick}>
      <div
        className={`${styles.tagInner} ${onClick ? styles.clickable : ''} ${removeTag ? styles.isRemovable : ''}`}
        style={tagStyle}
      >
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

export default connector(Tag);
