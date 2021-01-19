import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {sortBy} from 'lodash-es';

import {SearchField, LinkButton, Button} from '@airyhq/components';
import {Tag as TagModel, Channel, listTags} from 'httpclient';

import {setFilter, resetFilter} from '../../../actions/conversationsFilter';

import {StateModel} from '../../../reducers';

import {IconChannelFilter} from '../../../components/SimpleIconChannel';
import DialogCustomizable from '../../../components/DialogCustomizable';
import Tag from '../../Tags/Tag';

import {ReactComponent as CheckmarkIcon} from '../../../assets/images/icons/checkmark.svg';
import {ReactComponent as ConversationDone} from '../../../assets/images/icons/checkmark-circle.svg';

import styles from './Popup.module.scss';
import { ConversationStateEnum } from '../../../../../../lib/typescript/httpclient/model/ConversationFilter';

function mapStateToProps(state: StateModel) {
  return {
    user: state.data.user,
    filter: state.data.conversations.filtered.currentFilter,
    tags: state.data.tags.all,
    channels: state.data.channels,
  };
}

const mapDispatchToProps = {
  setFilter,
  resetFilter,
  listTags,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PopUpFilterProps = {
  closeCallback: () => void;
} & ConnectedProps<typeof connector>;

const PopUpFilter = (props: PopUpFilterProps) => {
  const {filter, channels, tags, closeCallback, setFilter} = props;

  const [pageSearch, setPageSearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');

  useEffect(() => {
    listTags();
  });

  const applyPressed = () => {
    closeCallback();
  };

  const resetPressed = e => {
    e.stopPropagation();
    resetFilter();
    closeCallback();
  };

  const toggleReadOnly = e => {
    e.stopPropagation();
    if (filter.maxUnreadMessageCount !== 0) {
      setFilter({maxUnreadMessageCount: 0, minUnreadMessageCount: undefined});
    } else {
      setFilter({maxUnreadMessageCount: undefined, minUnreadMessageCount: undefined});
    }
  };

  const toggleUnreadOnly = e => {
    e.stopPropagation();
    if (filter.minUnreadMessageCount !== 1) {
      setFilter({maxUnreadMessageCount: undefined, minUnreadMessageCount: 1});
    } else {
      setFilter({maxUnreadMessageCount: undefined, minUnreadMessageCount: undefined});
    }
  };

  const toggleOpenOnly = e => {
    e.stopPropagation();
    if (filter.state !== ConversationStateEnum.open) {
      setFilter({state: ConversationStateEnum.open});
    } else {
      setFilter({state: undefined});
    }
  };

  const toggleDoneOnly = e => {
    e.stopPropagation();
    if (filter.state !== ConversationStateEnum.closed) {
      setFilter({state: ConversationStateEnum.closed});
    } else {
      setFilter({state: undefined});
    }
  };

  const isChannelSelected = (channel: Channel) => (filter.channelIds || []).includes(channel.id);

  const toggleChannel = (e, channel: Channel) => {
    e.stopPropagation();
    const channels = filter.channelIds || [];
    if (isChannelSelected(channel)) {
      channels.splice(channels.indexOf(channel.id), 1);
    } else {
      channels.push(channel.id);
    }
    setFilter({channelIds: channels});
  };

  const isTagSelected = (tag: TagModel) => {
    return (filter.contactTagIds || []).includes(tag.id);
  };

  const toggleTag = (tag: TagModel) => {    
    const contactTags = filter.contactTagIds || [];
    if (isTagSelected(tag)) {
      contactTags.splice(contactTags.indexOf(tag.id), 1);
    } else {
      contactTags.push(tag.id);
    }
    setFilter({contactTagIds: contactTags});
  };

  return (
    <DialogCustomizable
      close={() => applyPressed()}
      style={{marginTop: '10px'}}
      coverStyle={{backgroundColor: 'rgba(247,247,247,0.7)'}}>
      <div className={styles.content}>
        <div className={styles.filterColumn}>
          <div className={styles.filterItem}>
            <h3>Read/Unread</h3>
            <div className={styles.filterRow}>
              <button
                className={filter.maxUnreadMessageCount === 0 ? styles.filterButtonSelected : styles.filterButton}
                onClick={e => toggleReadOnly(e)}>
                Read Only
              </button>
              <button
                className={filter.minUnreadMessageCount === 1 ? styles.filterButtonSelected : styles.filterButton}
                onClick={e => toggleUnreadOnly(e)}>
                Unread Only
              </button>
            </div>
          </div>
          <div className={styles.filterItem}>
            <h3>State</h3>
            <div className={styles.filterRow}>
              <button
                className={filter.state === 'OPEN' ? styles.filterButtonSelected : styles.filterButton}
                onClick={e => toggleOpenOnly(e)}>
                <div className={styles.openIcon} />
                Open
              </button>
              <button
                className={filter.state === 'CLOSED' ? styles.filterButtonSelected : styles.filterButton}
                onClick={e => toggleDoneOnly(e)}>
                <ConversationDone aria-hidden />
                Done
              </button>
            </div>
          </div>
        </div>
        <div className={styles.filterColumn}>
          <h3>By Tags</h3>
          <div className={styles.searchField}>
            <SearchField
              placeholder="Search for Tags"
              value={tagSearch}
              setValue={(value: string) => setTagSearch(value)}
            />
          </div>
          <div className={styles.tagList}>
            {sortBy(tags, tag => tag.name)
              .filter((tag: TagModel) => tag.name.toLowerCase().includes(tagSearch.toLowerCase()))
              .map((tag: TagModel) => (
                <Tag
                  key={tag.id}
                  tag={tag}
                  variant={isTagSelected(tag) ? 'default' : 'light'}
                  onClick={() => toggleTag(tag)}
                />                
              ))}
          </div>
        </div>

        {channels.length > 1 ? (
          <div className={styles.filterColumn}>
            <h3>By Channel</h3>
            <div className={styles.searchField}>
              <SearchField
                placeholder="Search for Channel"
                value={pageSearch}
                setValue={(value: string) => setPageSearch(value)}
              />
            </div>
            <div className={styles.sourcesList}>
              {sortBy(channels, channel => channel.name)
                .filter((channel: Channel) => channel.name.toLowerCase().includes(pageSearch.toLowerCase()))
                .map((channel, key) => (
                  <div
                    key={key}
                    className={`${styles.sourceEntry} ${isChannelSelected(channel) ? styles.sourceSelected : ''}`}
                    onClick={event => toggleChannel(event, channel)}>
                    {isChannelSelected(channel) ? (
                      <div className={styles.checkmarkIcon}>
                        <CheckmarkIcon aria-hidden />
                      </div>
                    ) : (
                      <div className={styles.channelLogoWrapper}>
                        <IconChannelFilter channel={channel} />
                      </div>
                    )}

                    <div className={styles.pageName}>{channel.name}</div>
                  </div>
                ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.buttonRow}>
        <LinkButton onClick={e => resetPressed(e)}>Clear All</LinkButton>
        <Button styleVariant="outline-big" onClick={() => applyPressed()}>
          Apply
        </Button>
      </div>
    </DialogCustomizable>
  );
};

export default connector(PopUpFilter);
