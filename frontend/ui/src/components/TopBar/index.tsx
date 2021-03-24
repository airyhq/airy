import React, {useState, useCallback} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {withRouter, Link, RouteComponentProps} from 'react-router-dom';
import {ListenOutsideClick} from '@airyhq/components';
import {StateModel} from '../../reducers';
import {ReactComponent as LogoutIcon} from 'assets/images/icons/sign-out.svg';
import {ReactComponent as ShortcutIcon} from 'assets/images/icons/shortcut.svg';
import {ReactComponent as AiryLogo} from 'assets/images/logo/airy_primary_rgb.svg';
import {ReactComponent as ChevronDownIcon} from 'assets/images/icons/chevron-down.svg';
import {LOGOUT_ROUTE} from '../../routes/routes';
import styles from './index.module.scss';

interface TopBarProps {
  isAdmin: boolean;
}

const mapStateToProps = (state: StateModel) => {
  return {
    user: state.data.user,
    firstName: state.data.user.firstName,
    lastName: state.data.user.lastName,
    isAuthSuccess: state.data.user.token,
  };
};

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
    <>
      <div className={styles.topBar}>
        {props.isAuthSuccess && (
          <>
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
                    <div className={styles.dropdown}>
                      <a href="mailto:support@airy.co" className={styles.dropdownLine}>
                        <span className={styles.dropdownIcon}>
                          <ShortcutIcon />
                        </span>
                        <span>Contact us</span>
                      </a>
                      <a
                        href="https://airy.co/faq"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.dropdownLine}>
                        <span className={styles.dropdownIcon}>
                          <ShortcutIcon />
                        </span>
                        <span>FAQ</span>
                      </a>
                    </div>
                  </ListenOutsideClick>
                )}
              </div>

              <div className={styles.menuItem}>
                <div className={styles.dropDown} onClick={accountClickHandler}>
                  <div className={styles.accountDetails}>
                    <div className={styles.accountName}>{props.firstName + ' ' + props.lastName}</div>
                  </div>
                  <div className={`${styles.dropHint} ${isAccountDropdownOn ? styles.dropHintOpen : ''}`}>
                    <span className={styles.chevronDown}>
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>

                {isAccountDropdownOn && (
                  <ListenOutsideClick onOuterClick={hideAccountDropdown}>
                    <div className={styles.dropdown}>
                      <Link to={LOGOUT_ROUTE} className={styles.dropdownLine}>
                        <span className={styles.dropdownIcon}>
                          <LogoutIcon />
                        </span>
                        <span>Logout</span>
                      </Link>
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
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default withRouter(connect(mapStateToProps)(TopBar));
