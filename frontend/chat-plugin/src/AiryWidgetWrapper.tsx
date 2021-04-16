import React, {useEffect} from 'react';
import {AiryWidgetConfiguration} from './config';
import AiryWidget from './AiryWidget';

import styles from './AiryWidgetWrapper.module.scss';

export const AiryWidgetWrapper = (config: AiryWidgetConfiguration) => {

  useEffect(() => {
    const chatpluginContainer = document.getElementById('chatpluginContainerId');
    const anchor = document.createElement('div');
    const chatPlugin = new AiryWidget({...config});
    chatPlugin.render(anchor);
    if (!chatpluginContainer.children.length) {
      chatpluginContainer.appendChild(anchor);
    }
  }, [config]);

  return (
    <div id="chatpluginContainerId" className={styles.chatpluginWrapper}/>
  );
}
