import {Source} from 'model';
import React from 'react';
import CreateUpdateSection from '../Providers/Airy/ChatPlugin/sections/CreateUpdateSection/CreateUpdateSection';
import FacebookConnect from '../Providers/Facebook/Messenger/FacebookConnect';
import GoogleConnect from '../Providers/Google/GoogleConnect';
import TwilioConnect from '../Providers/Twilio/TwilioConnect';
import ViberConnect from '../Providers/Viber/ViberConnect';
import WhatsappConnect from '../Providers/WhatsappBusinessCloud/WhatsappConnect';
import styles from './ConnectChannelModal.module.scss';

type ConnectChannelModaProps = {
  source: Source;
};

export const ConnectChannelModal = (props: ConnectChannelModaProps) => {
  const {source} = props;

  const InputValues = () => {
    switch (source) {
      case Source.chatPlugin:
        return <CreateUpdateSection modal />;
      case Source.google:
        return <GoogleConnect modal />;
      case Source.facebook:
        return <FacebookConnect modal />;
      case Source.twilioSMS:
        return <TwilioConnect modal />;
      case Source.whatsapp:
        return <WhatsappConnect modal />;
      case Source.viber:
        return <ViberConnect modal />;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
        <InputValues />
      </div>
    </div>
  );
};
