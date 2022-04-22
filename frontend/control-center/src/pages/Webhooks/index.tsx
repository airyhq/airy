import {Button} from 'components/cta/Button';
import {Webhook} from 'model/Webhook';
import React, {useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {listWebhooks} from '../../actions/webhook';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services/pageTitle';
import styles from './index.module.scss';
import WebhooksListItem from './WebhooksListItem';

type WebhooksProps = {} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => ({
  webhooks: state.data.webhooks,
});

const mapDispatchToProps = {
  listWebhooks,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const Webhooks = (props: WebhooksProps) => {
  const {listWebhooks, webhooks} = props;

  useEffect(() => {
    setPageTitle('Webhooks');
  }, []);

  useEffect(() => {
    listWebhooks();
  }, []);

  return (
    <div className={styles.webhooksWrapper}>
      <div className={styles.webhooksHeadline}>
        <div className={styles.headlineContainer}>
          <h1 className={styles.webhooksHeadlineText}>Webhooks</h1>
          <Button onClick={() => {}} style={{fontSize: 13, width: '176px', height: '40px'}}>
            Subscribe Webhook
          </Button>
        </div>
      </div>
      <div className={styles.listHeader}>
        <h2>URL</h2>
        <h2>Name</h2>
        <h2>Events</h2>
        <h2>Status</h2>
      </div>
      <div>
        {webhooks &&
          Object.values(webhooks).map((webhook: Webhook, index) => (
            <WebhooksListItem id={webhook.id} url={webhook.url} switchId={`${index}`} key={index} />
          ))}
      </div>
    </div>
  );
};

export default connector(Webhooks);
