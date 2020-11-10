import React, { useState, useCallback } from "react";
import { connect, ConnectedProps } from "react-redux";
import { withRouter, Link, RouteComponentProps } from "react-router-dom";

import { StateModel } from "../../reducers";

import ListenOutsideClick from "../ListenOutsideClick";

import { ReactComponent as CogIcon } from "../../assets/images/icons/cog.svg";
import { ReactComponent as LogoutIcon } from "../../assets/images/icons/sign-out.svg";
import { ReactComponent as ShortcutIcon } from "../../assets/images/icons/shortcut.svg";
import { ReactComponent as SpeakBubbleIcon } from "../../assets/images/icons/speak-bubble.svg";
import { ReactComponent as AiryLogo } from "../../assets/images/logo/airy_primary_rgb.svg";
import { ReactComponent as ChevronDownIcon } from "../../assets/images/icons/chevron-down.svg";

import styles from "./index.module.scss";

const LOGOUT_ROUTE = "/logout";

interface TopBarProps {
  isAdmin: boolean;
}

const mapStateToProps = (state: StateModel) => {
  return {
    user: state.data.user,
    first_name: state.data.user.first_name,
    last_name: state.data.user.last_name,
    isAuthSuccess: state.data.user.token
  };
};

const connector = connect(mapStateToProps);

const TopBar = (
  props: TopBarProps & ConnectedProps<typeof connector> & RouteComponentProps
) => {
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

  const redirectURL = props.isAdmin
    ? "https://app.airy.co"
    : "https://admin.airy.co";
  const redirectText = props.isAdmin ? "Go to Inbox" : "Go to Admin";

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
                <ListenOutsideClick onOuterClick={hideFaqDropdown}>
                  <div className={styles.help} onClick={faqClickHandler}>
                    ?
                  </div>
                </ListenOutsideClick>

                {isFaqDropdownOn && (
                  <div className={styles.dropdown}>
                    <a
                      href="mailto:support@airy.co"
                      className={styles.dropdownLine}
                    >
                      <span className={styles.dropdownIcon}>
                        <ShortcutIcon />
                      </span>
                      <span>Contact us</span>
                    </a>
                    <a
                      href="https://airy.co/faq"
                      target="_blank"
                      className={styles.dropdownLine}
                    >
                      <span className={styles.dropdownIcon}>
                        <ShortcutIcon />
                      </span>
                      <span>FAQ</span>
                    </a>
                  </div>
                )}
              </div>

              <div className={styles.menuItem}>
                <ListenOutsideClick onOuterClick={hideAccountDropdown}>
                  <div
                    className={styles.dropDown}
                    onClick={accountClickHandler}
                  >
                    <div className={styles.accountDetails}>
                      <div className={styles.accountName}>
                        {props.first_name + " " + props.last_name}
                      </div>
                    </div>
                    <div
                      className={`${styles.dropHint} ${
                        isAccountDropdownOn ? styles.dropHintOpen : ""
                      }`}
                    >
                      <span className={styles.chevronDown}>
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>
                </ListenOutsideClick>

                {isAccountDropdownOn && (
                  <div className={styles.dropdown}>
                    {props.isAdmin ? (
                      <a
                        href="https://app.airy.co"
                        target="_blank"
                        className={styles.dropdownLine}
                      >
                        <span className={styles.dropdownIcon}>
                          <SpeakBubbleIcon />
                        </span>
                        <span>Go to Inbox</span>
                      </a>
                    ) : (
                      <a
                        href="https://admin.airy.co"
                        target="_blank"
                        className={styles.dropdownLine}
                      >
                        <span className={styles.dropdownIcon}>
                          <CogIcon />
                        </span>
                        <span>Go to Admin</span>
                      </a>
                    )}
                    <Link to={LOGOUT_ROUTE} className={styles.dropdownLine}>
                      <span className={styles.dropdownIcon}>
                        <LogoutIcon />
                      </span>
                      <span>Logout</span>
                    </Link>
                    <div className={styles.dropdownLastLine}>
                      <a
                        className={styles.dropdownLastLink}
                        href="https://airy.co/terms-of-service"
                      >
                        T&Cs
                      </a>
                      <a
                        className={styles.dropdownLastLink}
                        href="https://airy.co/privacy-policy"
                      >
                        Privacy Policy
                      </a>
                    </div>
                  </div>
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
