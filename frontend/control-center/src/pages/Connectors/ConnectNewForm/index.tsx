import React, {SetStateAction} from 'react';
import RestartPopUp from '../RestartPopUp';
import styles from './index.module.scss';

interface ConnectNewFormProps {
  children: JSX.Element[];
  componentName: string;
  isUpdateModalVisible: boolean;
  setIsUpdateModalVisible: React.Dispatch<SetStateAction<boolean>>;
}

export const ConnectNewForm = ({
  children,
  componentName,
  isUpdateModalVisible,
  setIsUpdateModalVisible,
}: ConnectNewFormProps) => {
  return (
    <section className={styles.formWrapper}>
      <div className={styles.settings}>
        <form>{children}</form>
      </div>
      {isUpdateModalVisible && (
        <RestartPopUp componentName={componentName} closeRestartPopUp={() => setIsUpdateModalVisible(false)} />
      )}
    </section>
  );
};
