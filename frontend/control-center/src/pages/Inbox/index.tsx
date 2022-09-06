import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {listChannels, listComponents} from '../../actions';
import {StateModel} from '../../reducers';
import {allChannelsConnected} from '../../selectors/channels';
import {setPageTitle} from '../../services/pageTitle';
import {ChannelCard} from '../Connectors/ChannelCard';
import {EmptyStateInbox} from './EmptyStateInbox';
import {Channel, Source} from 'model';
import {formatComponentNameToConfigKey} from '../../services';
import styles from './index.module.scss';

const mapDispatchToProps = {
  listChannels,
  listComponents,
};

const connector = connect(null, mapDispatchToProps);

const Inbox = (props: ConnectedProps<typeof connector>) => {
  const channels = useSelector((state: StateModel) => Object.values(allChannelsConnected(state)));
  const catalogList = useSelector((state: StateModel) => state.data.catalog);
  const channelsBySource = (Source: Source) => channels.filter((channel: Channel) => channel.source === Source);
  const [inboxList, setInboxList] = useState([]);

  const catalogListArr = Object.entries(catalogList);
  const emptyCatalogList = catalogListArr.length === 0;

  useEffect(() => {
    props.listComponents();
  }, []);

  useEffect(() => {
    if (Object.entries(catalogList).length > 0) {
      const list = [];
      catalogListArr.map(component => {
        if (component[1]?.displayName) {
          const configKey = formatComponentNameToConfigKey(component[1].displayName);
          list.push({
            name: component[1].name,
            displayName: component[1].displayName,
            configKey: configKey,
            source: component[1].source,
          });
        }
      });
      setInboxList(list);
    }
  }, [catalogList]);

  useEffect(() => {
    if (channels.length === 0) {
      props.listChannels();
    }
  }, [channels.length]);

  useEffect(() => {
    setPageTitle('Inbox');
  }, []);

  return (
    <div className={styles.inboxWrapper}>
      {!emptyCatalogList && (
        <div className={styles.inboxHeadline}>
          <div>
            <h1 className={styles.inboxHeadlineText}>Inbox</h1>
          </div>
        </div>
      )}
      <div className={styles.wrapper}>
        {emptyCatalogList ? (
          <EmptyStateInbox />
        ) : (
          <div className={styles.channelsLine}>
            <div className={styles.channelsLineWrapper}>
              <h1 className={styles.channelsTitle}>Channels</h1>
              <div className={styles.lineContainer}>
                <div className={styles.lineBlue}></div>
                <div className={styles.lineGrey}></div>
              </div>
            </div>
            <div className={styles.channelsContainer}>
              {inboxList.map((item: {name: string; displayName: string; configKey: string; source: Source}) => {
                if (channelsBySource(item.source).length > 0) {
                  return <ChannelCard componentInfo={item} key={item.displayName} />;
                }
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default connector(Inbox);
