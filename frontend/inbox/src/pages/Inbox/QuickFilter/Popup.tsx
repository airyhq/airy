import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {omit, sortBy} from 'lodash-es';
import {SearchField, LinkButton, Button} from 'components';
import {Tag as TagModel, Channel, prettifySource} from 'model';
import {listTags} from '../../../actions';
import {setFilter} from '../../../actions';
import {ConversationFilter, StateModel} from '../../../reducers';
import DialogCustomizable from '../../../components/DialogCustomizable';
import Tag from '../../../components/Tag';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmark.svg';
import {ReactComponent as CheckmarkCircleIcon} from 'assets/images/icons/checkmarkCircle.svg';
import styles from './Popup.module.scss';
import {allChannels} from '../../../selectors/channels';
import ChannelAvatar from '../../../components/ChannelAvatar';
import {SourceIcon} from '../../../components/SourceIcon';
import {useTranslation} from 'react-i18next';

function mapStateToProps(state: StateModel) {
  const channels: Channel[] = Object.values(allChannels(state));
  return {
    user: state.data.user,
    filter: state.data.conversations.filtered.currentFilter,
    tags: state.data.tags.all,
    channels,
    sources: channels.reduce<Set<string>>((acc, {source}) => {
      acc.add(source);
      return acc;
    }, new Set<string>()),
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
  const {filter, channels, tags, listTags, closeCallback, setFilter, sources} = props;
  const [channelSearch, setChannelSearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');
  const {t} = useTranslation();

  useEffect(() => {
    listTags();
  }, [listTags]);

  const onReset = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setFilter({});
    closeCallback();
  };

  const toggleReadOnly = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    const newFilter: ConversationFilter = {
      ...filter,
      readOnly: !filter.readOnly,
      unreadOnly: filter.readOnly,
    };
    setFilter(newFilter);
  };

  const toggleUnreadOnly = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    const newFilter: ConversationFilter = {
      ...filter,
      unreadOnly: !filter.unreadOnly,
      readOnly: filter.unreadOnly,
    };
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

  const isSourceSelected = (sourcesList: Array<string>, source: string) => {
    return (sourcesList || []).includes(source);
  };

  const toggleSelection = filterKey => (id: string) => {
    let items = filter[filterKey] || [];
    items = items.includes(id) ? items.filter(item => item !== id) : items.concat([id]);
    if (items.length > 0) {
      setFilter({
        ...filter,
        [filterKey]: items,
      });
    } else {
      setFilter(omit(filter, filterKey));
    }
  };

  const isTagSelected = (tagList: string[], tag: TagModel) => (tagList || []).includes(tag.id);

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

  const toggleChannel = toggleSelection('byChannels');
  const toggleSource = toggleSelection('bySources');

  return (
    <DialogCustomizable
      close={closeCallback}
      style={{marginTop: '20px', left: '0px', marginLeft: '215px'}}
      coverStyle={{backgroundColor: 'rgba(247,247,247,0.7)'}}
    >
      <div id="dialogContent" className={styles.content}>
        <div className={styles.filterColumn}>
          <div className={styles.filterStateContainer}>
            <div className={styles.filterItem}>
              <h3>{t('readUnread')}</h3>
              <div className={styles.filterRow}>
                <button
                  className={filter.readOnly ? styles.filterButtonSelected : styles.filterButton}
                  onClick={toggleReadOnly}
                >
                  {t('readOnly')}
                </button>
                <button
                  className={filter.unreadOnly ? styles.filterButtonSelected : styles.filterButton}
                  onClick={toggleUnreadOnly}
                >
                  {t('unreadOnly')}
                </button>
              </div>
            </div>
          </div>
          <div className={styles.filterColumn}>
            <div className={styles.filterItem}>
              <h3>{t('stateCapital')}</h3>
              <div className={styles.filterRow}>
                <button
                  className={
                    !filter.isStateOpen || filter.isStateOpen === undefined
                      ? styles.filterButton
                      : styles.filterButtonSelected
                  }
                  onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => setState(event, true)}
                >
                  <div className={styles.openIconButton} />
                  {t('open')}
                </button>
                <button
                  className={
                    filter.isStateOpen || filter.isStateOpen === undefined
                      ? styles.filterButton
                      : styles.filterButtonSelected
                  }
                  onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => setState(event, false)}
                >
                  <div className={styles.checkmarkCircleIcon}>
                    <CheckmarkCircleIcon />
                  </div>
                  {t('closed')}
                </button>
              </div>
            </div>
          </div>
        </div>
        {Object.keys(tags).length > 0 && (
          <div className={styles.filterColumn}>
            <h3>{t('byTags')}</h3>
            <div className={styles.searchField}>
              <SearchField
                placeholder={t('searchTags')}
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
        )}

        {channels.length > 1 && (
          <div className={styles.filterColumn}>
            <h3>{t('byChannel')}</h3>
            <div className={styles.searchField}>
              <SearchField
                placeholder={t('searchChannel')}
                value={channelSearch}
                setValue={(value: string) => setChannelSearch(value)}
              />
            </div>
            <div className={styles.sourcesList}>
              {sortBy(channels, channel => channel.metadata?.name)
                .filter((channel: Channel) =>
                  channel.metadata?.name.toLowerCase().includes(channelSearch.toLowerCase())
                )
                .map((channel, key) => (
                  <div
                    key={key}
                    className={`${styles.sourceEntry} ${
                      isChannelSelected(filter.byChannels, channel) ? styles.sourceSelected : ''
                    }`}
                    onClick={() => toggleChannel(channel.id)}
                  >
                    {isChannelSelected(filter.byChannels, channel) ? (
                      <div className={styles.checkmarkIcon}>
                        <CheckmarkIcon aria-hidden />
                      </div>
                    ) : (
                      <ChannelAvatar channel={channel} style={{height: '24px', width: '24px', marginRight: '4px'}} />
                    )}
                    <div className={styles.itemName}>{channel.metadata?.name || channel.sourceChannelId}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {sources.size > 1 && (
          <div className={styles.filterColumn}>
            <h3>{t('bySource')}</h3>
            <div className={styles.sourcesList}>
              {Array.from<string>(sources)
                .sort()
                .map(source => (
                  <div
                    key={source}
                    className={`${styles.sourceEntry} ${
                      isSourceSelected(filter.bySources, source) ? styles.sourceSelected : ''
                    }`}
                    onClick={() => toggleSource(source)}
                  >
                    {isSourceSelected(filter.bySources, source) ? (
                      <div className={styles.checkmarkIcon}>
                        <CheckmarkIcon aria-hidden />
                      </div>
                    ) : (
                      <SourceIcon style={{height: '24px', width: '24px', marginRight: '4px'}} source={source} />
                    )}
                    <div className={styles.itemName}>{prettifySource(source)}</div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.buttonRow}>
        <LinkButton onClick={onReset}>{t('clearAll')}</LinkButton>
        <Button styleVariant="outline-big" onClick={closeCallback}>
          {t('apply')}
        </Button>
      </div>
    </DialogCustomizable>
  );
};

export default connector(PopUpFilter);
