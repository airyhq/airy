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
  enableSubmitConfigData: () => void;
} & ConnectedProps<typeof connector>;

const RestartPopUp = (props: RestartPopUpProps) => {
  const {closeRestartPopUp, componentName, enableDisableComponent, enableSubmitConfigData} = props;
  const {t} = useTranslation();

  const restartComponent = async e => {
    e.preventDefault();
    closeRestartPopUp();

    enableSubmitConfigData();
    await enableDisableComponent({components: [{name: componentName, enabled: false}]});
    await enableDisableComponent({components: [{name: componentName, enabled: true}]});
  };

  return (
    <SettingsModal
      wrapperClassName={styles.modalContainerWrapper}
      containerClassName={styles.modalContainer}
      close={closeRestartPopUp}
      headerClassName={styles.headerModal}
    >
      <p>{t('restartComponentUpdate')}</p>
      <Button styleVariant="normal" type="submit" onClick={e => restartComponent(e)} className={styles.restartButton}>
        {t('restart')}
      </Button>
    </SettingsModal>
  );
};

export default connector(RestartPopUp);
