import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {enableDisableComponent} from '../../../actions';
import {SettingsModal, Button} from 'components';
import styles from './index.module.scss';
import {useTranslation} from 'react-i18next';

const mapDispatchToProps = {
  enableDisableComponent,
};

const connector = connect(null, mapDispatchToProps);

type RestartPopUpProps = {
  closeRestartPopUp: () => void;
  componentName: string;
} & ConnectedProps<typeof connector>;

const RestartPopUp = (props: RestartPopUpProps) => {
  const {closeRestartPopUp, componentName, enableDisableComponent} = props;
  const {t} = useTranslation();

  const restartComponent = async () => {
    await enableDisableComponent({components: [{name: componentName, enabled: false}]});
    await enableDisableComponent({components: [{name: componentName, enabled: true}]});
    setTimeout(() => closeRestartPopUp(), 1000);
  };

  return (
    <SettingsModal
      wrapperClassName={styles.modalContainerWrapper}
      containerClassName={styles.modalContainer}
      close={closeRestartPopUp}
      headerClassName={styles.headerModal}
    >
      <p>{t('restartComponentUpdate')}</p>
      <Button styleVariant="normal" type="submit" onClick={restartComponent} className={styles.restartButton}>
        {t('restart')}
      </Button>
    </SettingsModal>
  );
};

export default connector(RestartPopUp);
