import React, {useState, useCallback, useLayoutEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {ListenOutsideClick} from 'components';
import {StateModel} from '../../reducers';
import {Toggle} from 'components';
import {ReactComponent as ShortcutIcon} from 'assets/images/icons/shortcut.svg';
import {ReactComponent as LogoutIcon} from 'assets/images/icons/signOut.svg';
import {ReactComponent as AiryLogoWithText} from 'assets/images/logo/airyPrimaryRgb.svg';
import {ReactComponent as AiryLogoWithTextDark} from 'assets/images/logo/airyLogoDark.svg';
import {ReactComponent as ChevronDownIcon} from 'assets/images/icons/chevronDown.svg';
import {ReactComponent as LanguageIcon} from 'assets/images/icons/languageIcon.svg';
import {ReactComponent as FlagUS} from 'assets/images/icons/flagUS.svg';
import {ReactComponent as FlagGermany} from 'assets/images/icons/flagGermany.svg';
import {ReactComponent as FlagFrance} from 'assets/images/icons/flagFrance.svg';
import {ReactComponent as FlagSpain} from 'assets/images/icons/flagSpain.svg';
import {ReactComponent as AiryLogo} from 'assets/images/logo/airyLogo.svg';
import styles from './index.module.scss';
import {env} from '../../env';
import {useAnimation} from 'render';
import {useTranslation} from 'react-i18next';
import {Language} from 'model/Config';
import i18next from 'i18next';

interface TopBarProps {
  isAdmin: boolean;
}

const mapStateToProps = (state: StateModel) => ({
  user: state.data.user,
  version: state.data.config.clusterVersion,
});

const controlCenterUrl = `${env.API_HOST}/control-center/`;
const logoutUrl = `${env.API_HOST}/logout`;

const connector = connect(mapStateToProps);

const TopBar = (props: TopBarProps & ConnectedProps<typeof connector>) => {
  const [isAccountDropdownOn, setAccountDropdownOn] = useState(false);
  const [isFaqDropdownOn, setFaqDropdownOn] = useState(false);
  const [isLanguageDropdownOn, setLanguageDropdownOn] = useState(false);
  const [darkTheme, setDarkTheme] = useState(localStorage.getItem('theme') === 'dark' ? true : false);
  const [animationAction, setAnimationAction] = useState(false);
  const [chevronAnim, setChevronAnim] = useState(false);
  const [chevronLanguageAnim, setChevronLanguageAnim] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('language') || Language.english);
  const {t} = useTranslation();

  useLayoutEffect(() => {
    handleLanguage(localStorage.getItem('language'));
  }, []);

  const toggleAccountDropdown = useCallback(() => {
    setChevronAnim(!chevronAnim);
    useAnimation(isAccountDropdownOn, setAccountDropdownOn, setAnimationAction, 300);
  }, [setAccountDropdownOn, isAccountDropdownOn]);

  const toggleFaqDropdown = useCallback(() => {
    useAnimation(isFaqDropdownOn, setFaqDropdownOn, setAnimationAction, 300);
  }, [setFaqDropdownOn, isFaqDropdownOn]);

  const toggleLanguageDropdown = useCallback(() => {
    setChevronLanguageAnim(!chevronLanguageAnim);
    useAnimation(isLanguageDropdownOn, setLanguageDropdownOn, setAnimationAction, 300);
  }, [setLanguageDropdownOn, isLanguageDropdownOn]);

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

  const handleLanguage = (language: string) => {
    switch (language) {
      case Language.english:
        setCurrentLanguage(Language.english);
        localStorage.setItem('language', Language.english);
        i18next.changeLanguage('en').then(t => {
          t('en');
        });
        break;
      case Language.german:
        setCurrentLanguage(Language.german);
        localStorage.setItem('language', Language.german);
        i18next.changeLanguage('de').then(t => {
          t('de');
        });
        break;
      case Language.spanish:
        setCurrentLanguage(Language.spanish);
        localStorage.setItem('language', Language.spanish);
        i18next.changeLanguage('es').then(t => {
          t('es');
        });
        break;
      case Language.french:
        setCurrentLanguage(Language.french);
        localStorage.setItem('language', Language.french);
        i18next.changeLanguage('fr').then(t => {
          t('fr');
        });
        break;
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
                    <span>{t('contactUs')}</span>
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

        <div className={styles.menuItem}>
          <div className={styles.dropDown} onClick={toggleLanguageDropdown}>
            <LanguageIcon width={24} />
            <span style={{marginRight: '12px', marginLeft: '4px'}}>{currentLanguage}</span>
            <div className={`${styles.dropHint} ${chevronLanguageAnim ? styles.dropHintOpen : styles.dropHintClose}`}>
              <span className={styles.chevronDown}>
                <ChevronDownIcon />
              </span>
            </div>
          </div>
          <div className={animationAction ? styles.animateIn : styles.animateOut}>
            {isLanguageDropdownOn && (
              <ListenOutsideClick onOuterClick={toggleLanguageDropdown}>
                <div className={styles.dropdownContainer}>
                  {currentLanguage !== Language.english && (
                    <div onClick={() => handleLanguage(Language.english)} className={styles.dropdownLine}>
                      <span className={styles.dropdownIconLanguage}>
                        <FlagUS />
                      </span>
                      <span>{Language.english}</span>
                    </div>
                  )}
                  {currentLanguage !== Language.german && (
                    <div onClick={() => handleLanguage(Language.german)} className={styles.dropdownLine}>
                      <span className={styles.dropdownIconLanguage}>
                        <FlagGermany />
                      </span>
                      <span>{Language.german}</span>
                    </div>
                  )}
                  {currentLanguage !== Language.french && (
                    <div onClick={() => handleLanguage(Language.french)} className={styles.dropdownLine}>
                      <span className={styles.dropdownIconLanguage}>
                        <FlagFrance />
                      </span>
                      <span>{Language.french}</span>
                    </div>
                  )}
                  {currentLanguage !== Language.spanish && (
                    <div onClick={() => handleLanguage(Language.spanish)} className={styles.dropdownLine}>
                      <span className={styles.dropdownIconLanguage}>
                        <FlagSpain />
                      </span>
                      <span>{Language.spanish}</span>
                    </div>
                  )}
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
                      <span>{t('logout')}</span>
                    </a>
                    <div className={styles.dropDownVersionContainer}>
                      <a
                        id={styles.dropDownLink}
                        href="https://airy.co/docs/core/changelog"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t('releaseNotes')}
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
