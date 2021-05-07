import React, {useState, useCallback} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import {ListenOutsideClick} from 'components';
import {StateModel} from '../../reducers';
import {ReactComponent as ShortcutIcon} from 'assets/images/icons/shortcut.svg';
import {ReactComponent as LogoutIcon} from 'assets/images/icons/sign-out.svg';
import {ReactComponent as AiryLogo} from 'assets/images/logo/airy_primary_rgb.svg';
import {ReactComponent as ChevronDownIcon} from 'assets/images/icons/chevron-down.svg';
import styles from './index.module.scss';
import {env} from '../../env';

interface TopBarProps {
  isAdmin: boolean;
}

const mapStateToProps = (state: StateModel) => ({
  user: state.data.user,
});

const logoutUrl = `${env.API_HOST}/logout`;

const connector = connect(mapStateToProps);

const TopBar = (props: TopBarProps & ConnectedProps<typeof connector> & RouteComponentProps) => {
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
        <AiryLogo className={styles.airyLogoSvg} />
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

export default withRouter(connect(mapStateToProps)(TopBar));
