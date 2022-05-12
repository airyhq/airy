import React, {useState, useCallback} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {ListenOutsideClick} from 'components';
import {StateModel} from '../../reducers';
import {Toggle} from 'components';
import {ReactComponent as ShortcutIcon} from 'assets/images/icons/shortcut.svg';
import {ReactComponent as LogoutIcon} from 'assets/images/icons/signOut.svg';
import {ReactComponent as AiryLogoWithText} from 'assets/images/logo/airyPrimaryRgb.svg';
import {ReactComponent as AiryLogoWithTextDark} from 'assets/images/logo/airyLogoDark.svg';
import {ReactComponent as ChevronDownIcon} from 'assets/images/icons/chevronDown.svg';
import {ReactComponent as AiryLogo} from 'assets/images/logo/airyLogo.svg';
import styles from './index.module.scss';
import {env} from '../../env';
import {useAnimation} from 'render';

interface TopBarProps {
  isAdmin: boolean;
}

const mapStateToProps = (state: StateModel) => ({
  user: state.data.user,
  version: state.data.config.clusterVersion,
});

const controlCenterUrl = `${env.API_HOST}/control-center`;
const logoutUrl = `${env.API_HOST}/logout`;

const connector = connect(mapStateToProps);

const TopBar = (props: TopBarProps & ConnectedProps<typeof connector>) => {
  const [isAccountDropdownOn, setAccountDropdownOn] = useState(false);
  const [isFaqDropdownOn, setFaqDropdownOn] = useState(false);
  const [darkTheme, setDarkTheme] = useState(localStorage.getItem('theme') === 'dark' ? true : false);
  const [animationAction, setAnimationAction] = useState(false);
  const [chevronAnim, setChevronAnim] = useState(false);

  const toggleAccountDropdown = useCallback(() => {
    useAnimation(isAccountDropdownOn, setAccountDropdownOn, setAnimationAction, 300);
    setChevronAnim(!chevronAnim);
  }, [setAccountDropdownOn, isAccountDropdownOn]);

  const toggleFaqDropdown = useCallback(() => {
    useAnimation(isFaqDropdownOn, setFaqDropdownOn, setAnimationAction, 300);
  }, [setFaqDropdownOn, isFaqDropdownOn]);

  const toggleDarkTheme = () => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('theme');
      setDarkTheme(false);
    } else {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      setDarkTheme(true);
    }
  };

  return (
    <div className={styles.topBar}>
      <div className={styles.airyLogo}>
        {!darkTheme ? (
          <AiryLogoWithText className={styles.airyLogoSvg} />
        ) : (
          <AiryLogoWithTextDark className={styles.airyLogoSvg} />
        )}
      </div>
      <div className={styles.menuArea}>
        <div className={styles.menuItem}>
          <div className={styles.help} onClick={toggleFaqDropdown}>
            ?
          </div>

          <div className={animationAction ? styles.animateIn : styles.animateOut}>
            {isFaqDropdownOn && (
              <ListenOutsideClick onOuterClick={toggleFaqDropdown}>
                <div className={styles.dropdownContainer}>
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
                    className={styles.dropdownLine}
                  >
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
        </div>

        {props.user.name && (
          <div className={styles.menuItem}>
            <div className={styles.dropDown} onClick={toggleAccountDropdown}>
              <div className={styles.accountDetails}>
                <div className={styles.accountName}>{props.user.name}</div>
              </div>
              <div className={`${styles.dropHint} ${chevronAnim ? styles.dropHintOpen : styles.dropHintClose}`}>
                <span className={styles.chevronDown}>
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div className={animationAction ? styles.animateIn : styles.animateOut}>
              {isAccountDropdownOn && (
                <ListenOutsideClick onOuterClick={toggleAccountDropdown}>
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
                    <div className={styles.dropDownVersionContainer}>
                      <a
                        id={styles.dropDownLink}
                        href="https://airy.co/docs/core/changelog"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Release notes
                      </a>
                      <h1>Version {props.version}</h1>
                    </div>
                  </div>
                </ListenOutsideClick>
              )}
            </div>
          </div>
        )}
        <button className={styles.theme} onClick={toggleDarkTheme}>
          <Toggle updateValue={toggleDarkTheme} value={darkTheme} emojiBefore="☀️" emojiAfter="🌙" />
        </button>
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(TopBar);
