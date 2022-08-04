import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {listComponents} from '../../actions/catalog';
import {StateModel} from '../../reducers';
import {setPageTitle} from '../../services/pageTitle';
import {Source, ComponentInfo} from 'model';
import CatalogCard from './CatalogCard';
import styles from './index.module.scss';

const mapDispatchToProps = {
  listComponents,
};

const connector = connect(null, mapDispatchToProps);

export const findSourceForComponent = (displayName: string) => {
  switch (displayName) {
    case 'Airy Chat Plugin':
      return Source.chatPlugin;
    case 'Facebook Messenger':
      return Source.facebook;
    case 'Twilio SMS':
      return Source.twilioSMS;
    case 'Twilio WhatsApp':
      return Source.twilioWhatsApp;
    case 'Google Business Messages':
      return Source.google;
    case 'Instagram':
      return Source.instagram;
    case 'Dialogflow':
      return Source.dialogflow;
    case 'Salesforce':
      return Source.salesforce;
    case 'Zendesk':
      return Source.zendesk;
  }
};

const Catalog = (props: ConnectedProps<typeof connector>) => {
  const {listComponents} = props;
  const catalogList = useSelector((state: StateModel) => state.data.catalog);
  const {t} = useTranslation();
  const catalogPageTitle = t('Catalog');

  useEffect(() => {
    listComponents();
    setPageTitle(catalogPageTitle);
  }, []);

  return (
    <section className={styles.catalogWrapper}>
      <h1 className={styles.catalogHeadlineText}>{catalogPageTitle}</h1>

      <section className={styles.catalogListContainer}>
        {Object.values(catalogList).map((infoItem: ComponentInfo) => {
          if (findSourceForComponent(infoItem.displayName)) {
            return <CatalogCard componentInfo={infoItem} key={infoItem.displayName} />;
          }
        })}
      </section>
    </section>
  );
};

export default connector(Catalog);
