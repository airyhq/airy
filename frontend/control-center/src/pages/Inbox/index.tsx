import React, {useEffect, useState} from 'react';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {listChannels, listComponents} from '../../actions';
import {StateModel} from '../../reducers';
import {allChannelsConnected} from '../../selectors/channels';
import {setPageTitle} from '../../services/pageTitle';
import {ChannelCard} from '../Connectors/ChannelCard';
import {EmptyStateInbox} from './EmptyStateInbox';
import {Source} from 'model';
import {Channel} from 'model/Channel';
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
      catalogListArr.map(component => {
        if (component[1]?.displayName) {
          console.log('component', component);
          console.log('component[1].displayName', component[1].displayName);
          const configKey = formatComponentNameToConfigKey(component[1].displayName);
          setInboxList(prevState => [
            ...prevState,
            {
              name: component[1].name,
              displayName: component[1].displayName,
              configKey: configKey,
              source: component[1].source,
            },
          ]);
        }
      });
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
            <div style={{display: 'flex', flexDirection: 'column', marginBottom: '36px'}}>
              <span style={{marginBottom: '16px', marginTop: '16px', marginLeft: '36px'}}>Channels</span>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <div style={{width: '150px', height: '4px', background: '#1578D4'}}></div>
                <div style={{width: '100%', height: '1px', background: '#CAD5DB'}}></div>
              </div>
            </div>
            <div className={styles.channelsContainer}>
              {inboxList.map((item: {name: string; displayName: string; configKey: string; source: Source}) => {
                console.log('item', item);
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
