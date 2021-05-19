import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {omit, sortBy} from 'lodash-es';
import {SearchField, LinkButton, Button} from 'components';
import {Tag as TagModel, Channel, ConversationFilter} from 'model';
import {listTags} from '../../../actions/tags';
import {setFilter} from '../../../actions/conversationsFilter';
import {StateModel} from '../../../reducers';
import DialogCustomizable from '../../../components/DialogCustomizable';
import Tag from '../../../components/Tag';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmark.svg';
import {ReactComponent as CheckmarkCircleIcon} from 'assets/images/icons/checkmark-circle.svg';
import styles from './Popup.module.scss';
import {allChannels} from '../../../selectors/channels';
import ChannelAvatar from '../../../components/ChannelAvatar';

function mapStateToProps(state: StateModel) {
  return {
    user: state.data.user,
    filter: state.data.conversations.filtered.currentFilter,
    tags: state.data.tags.all,
    channels: Object.values(allChannels(state)),
  };
}

const mapDispatchToProps = {
  setFilter,
  listTags,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PopUpFilterProps = {
  closeCallback: () => void;
} & ConnectedProps<typeof connector>;

const PopUpFilter = (props: PopUpFilterProps) => {
  const {filter, channels, tags, listTags, closeCallback, setFilter} = props;

  const [pageSearch, setPageSearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');

  useEffect(() => {
    listTags();
  }, [listTags]);

  const resetPressed = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setFilter({});
    closeCallback();
  };

  const toggleReadOnly = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    const newFilter: ConversationFilter = {...filter};
    newFilter.readOnly = !filter.readOnly;
    newFilter.unreadOnly = filter.readOnly;
    setFilter(newFilter);
  };

  const toggleUnreadOnly = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    const newFilter: ConversationFilter = {...filter};
    newFilter.unreadOnly = !filter.unreadOnly;
    newFilter.readOnly = filter.unreadOnly;
    setFilter(newFilter);
  };

  const setState = (e: React.MouseEvent<HTMLElement, MouseEvent>, isOpen: boolean) => {
    e.stopPropagation();
    const newFilter: ConversationFilter = {...filter};
    newFilter.isStateOpen === isOpen ? (newFilter.isStateOpen = !isOpen) : (newFilter.isStateOpen = isOpen);
    setFilter(newFilter);
  };

  const isChannelSelected = (channelsList: Array<string>, channel: Channel) => {
    return (channelsList || []).includes(channel.id);
  };

  const toggleChannel = (e: React.MouseEvent<HTMLElement, MouseEvent>, channel: Channel) => {
    e.stopPropagation();
    const channels = filter.byChannels ? [...filter.byChannels] : [];
    isChannelSelected(channels, channel) ? channels.splice(channels.indexOf(channel.id), 1) : channels.push(channel.id);

    if (channels.length > 0) {
      setFilter({
        ...filter,
        byChannels: channels,
      });
    } else {
      setFilter(omit(filter, 'byChannels'));
    }
  };

  const isTagSelected = (tagList: string[], tag: TagModel) => {
    return (tagList || []).includes(tag.id);
  };

  const toggleTag = (tag: TagModel) => {
    const tags = filter.byTags ? [...filter.byTags] : [];
    isTagSelected(tags, tag) ? tags.splice(tags.indexOf(tag.id), 1) : tags.push(tag.id);
    if (tags.length > 0) {
      setFilter({
        ...filter,
        byTags: tags,
      });
    } else {
      setFilter(omit(filter, 'byTags'));
    }
  };

  const OpenIcon = () => {
    return <div className={styles.openIconButton} />;
  };

  return (
    <DialogCustomizable
      close={closeCallback}
      style={{marginTop: '10px'}}
      coverStyle={{backgroundColor: 'rgba(247,247,247,0.7)'}}>
      <div className={styles.content}>
        <div className={styles.filterColumn}>
          <div className={styles.filterStateContainer}>
            <div className={styles.filterItem}>
              <h3>Read/Unread</h3>
              <div className={styles.filterRow}>
                <button
                  className={filter.readOnly ? styles.filterButtonSelected : styles.filterButton}
                  onClick={toggleReadOnly}>
                  Read Only
                </button>
                <button
                  className={filter.unreadOnly ? styles.filterButtonSelected : styles.filterButton}
                  onClick={toggleUnreadOnly}>
                  Unread Only
                </button>
              </div>
            </div>
          </div>
          <div className={styles.filterColumn}>
            <div className={styles.filterItem}>
              <h3>State</h3>
              <div className={styles.filterRow}>
                <button
                  className={
                    !filter.isStateOpen || filter.isStateOpen === undefined
                      ? styles.filterButton
                      : styles.filterButtonSelected
                  }
                  onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => setState(event, true)}>
                  <OpenIcon />
                  Open
                </button>
                <button
                  className={
                    filter.isStateOpen || filter.isStateOpen === undefined
                      ? styles.filterButton
                      : styles.filterButtonSelected
                  }
                  onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => setState(event, false)}>
                  <div className={styles.checkmarkCircleIcon}>
                    <CheckmarkCircleIcon />
                  </div>
                  Closed
                </button>
              </div>
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
                  variant={isTagSelected(filter.byTags, tag) ? 'default' : 'light'}
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
              {sortBy(channels, channel => channel.metadata?.name)
                .filter((channel: Channel) => channel.metadata?.name.toLowerCase().includes(pageSearch.toLowerCase()))
                .map((channel, key) => (
                  <div
                    key={key}
                    className={`${styles.sourceEntry} ${
                      isChannelSelected(filter.byChannels, channel) ? styles.sourceSelected : ''
                    }`}
                    onClick={event => toggleChannel(event, channel)}>
                    {isChannelSelected(filter.byChannels, channel) ? (
                      <div className={styles.checkmarkIcon}>
                        <CheckmarkIcon aria-hidden />
                      </div>
                    ) : (
                      <ChannelAvatar channel={channel} style={{height: '24px', width: '24px', marginRight: '4px'}} />
                    )}
                    <div className={styles.pageName}>{channel.metadata?.name || channel.sourceChannelId}</div>
                  </div>
                ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.buttonRow}>
        <LinkButton onClick={resetPressed}>Clear All</LinkButton>
        <Button styleVariant="outline-big" onClick={closeCallback}>
          Apply
        </Button>
      </div>
    </DialogCustomizable>
  );
};

export default connector(PopUpFilter);
