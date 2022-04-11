import React, {useState, useCallback} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {ListenOutsideClick} from 'components';
import {StateModel} from '../../reducers';
import {ReactComponent as ShortcutIcon} from 'assets/images/icons/shortcut.svg';
import {ReactComponent as LogoutIcon} from 'assets/images/icons/signOut.svg';
import {ReactComponent as AiryLogoWithText} from 'assets/images/logo/airyPrimaryRgb.svg';
import {ReactComponent as ChevronDownIcon} from 'assets/images/icons/chevronDown.svg';
import {ReactComponent as AiryLogo} from 'assets/images/logo/airyLogo.svg';
import styles from './index.module.scss';
import {env} from '../../env';

interface TopBarProps {
  isAdmin: boolean;
}

const mapStateToProps = (state: StateModel) => ({
  user: state.data.user,
});

const controlCenterUrl = `${env.API_HOST}/control-center`;
const logoutUrl = `${env.API_HOST}/logout`;

const connector = connect(mapStateToProps);

const TopBar = (props: TopBarProps & ConnectedProps<typeof connector>) => {
  const [isAccountDropdownOn, setAccountDropdownOn] = useState(false);
  const [isFaqDropdownOn, setFaqDropdownOn] = useState(false);

  const accountClickHandler = useCallback(() => {
    setAccountDropdownOn(!isAccountDropdownOn);
  }, [setAccountDropdownOn, isAccountDropdownOn]);

  const hideAccountDropdown = useCallback(() => {
    setAccountDropdownOn(false);
  }, [setAccountDropdownOn]);

  const faqClickHandler = useCallback(() => {
    setFaqDropdownOn(!isFaqDropdownOn);
  }, [setFaqDropdownOn, isFaqDropdownOn]);

  const hideFaqDropdown = useCallback(() => {
    setFaqDropdownOn(false);
  }, [setFaqDropdownOn]);

  return (
    <div className={styles.topBar}>
      <div className={styles.airyLogo}>
        <AiryLogoWithText className={styles.airyLogoSvg} />
      </div>
      <div className={styles.menuArea}>
        <div className={styles.menuItem}>
          <div className={styles.help} onClick={faqClickHandler}>
            ?
          </div>

          {isFaqDropdownOn && (
            <ListenOutsideClick onOuterClick={hideFaqDropdown}>
              <div className={styles.dropdownContainer}>
                <a href="mailto:support@airy.co" className={styles.dropdownLine}>
                  <span className={styles.dropdownIcon}>
                    <ShortcutIcon />
                  </span>
                  <span>Contact us</span>
                </a>
                <a href="https://airy.co/faq" target="_blank" rel="noopener noreferrer" className={styles.dropdownLine}>
                  <span className={styles.dropdownIcon}>
                    <ShortcutIcon />
                  </span>
                  <span>FAQ</span>
                </a>
                <div className={styles.dropdownLastLine}>
                  <a className={styles.dropdownLastLink} href="https://airy.co/terms-of-service">
                    T&Cs
                  </a>
                  <a className={styles.dropdownLastLink} href="https://airy.co/privacy-policy">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </ListenOutsideClick>
          )}
        </div>

        {props.user.name && (
          <div className={styles.menuItem}>
            <div className={styles.dropDown} onClick={accountClickHandler}>
              <div className={styles.accountDetails}>
                <div className={styles.accountName}>{props.user.name}</div>
              </div>
              <div className={`${styles.dropHint} ${isAccountDropdownOn ? styles.dropHintOpen : ''}`}>
                <span className={styles.chevronDown}>
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            {isAccountDropdownOn && (
              <ListenOutsideClick onOuterClick={hideAccountDropdown}>
                <div className={styles.dropdownContainer}>
                  <a href={controlCenterUrl} className={styles.dropdownLine}>
                    <span className={styles.dropdownIconControlCenter}>
                      <AiryLogo />
                    </span>
                    <span>Control-Center</span>
                  </a>
                  <a href={logoutUrl} className={styles.dropdownLine}>
                    <span className={styles.dropdownIcon}>
                      <LogoutIcon />
                    </span>
                    <span>Logout</span>
                  </a>
                </div>
              </ListenOutsideClick>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(TopBar);
