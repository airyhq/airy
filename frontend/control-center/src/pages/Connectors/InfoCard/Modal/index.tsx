import React, {useState, useRef} from 'react';
import {ReactComponent as CheckmarkIcon} from 'assets/images/icons/checkmarkFilled.svg';
import {Button, SettingsModal} from 'components';
import {useTranslation} from 'react-i18next';
import {connect, ConnectedProps} from 'react-redux';
import styles from './index.module.scss';


const InstallationToggleModal = () => {
    return(
        <SettingsModal
        Icon={CheckmarkIcon as React.ElementType}
        wrapperClassName={styles.enableModalContainerWrapper}
        containerClassName={styles.enableModalContainer}
        title={sourceInfo.title + ' ' + installedVar}
        close={() => setIsModalVisible(false)}
        headerClassName={styles.headerModal}>
        {!installed && (
          <Button styleVariant="normal" type="submit" onClick={() => console.log('configure installation')}>
            {t('toConfigure')}
          </Button>
        )}
      </SettingsModal>
    )
}