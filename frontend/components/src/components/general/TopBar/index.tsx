// @ts-nocheck
import React, { useState, useCallback } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

import { User } from "../../../model";
import ListenOutsideClick from "../ListenOutsideClick";

import styles from "./index.module.scss";

import { ReactComponent as CogIcon } from "../../../assets/images/icons/cog.svg";
import { ReactComponent as LogoutIcon } from "../../../assets/images/icons/sign-out.svg";
import { ReactComponent as ShortcutIcon } from "../../../assets/images/icons/shortcut.svg";
import { ReactComponent as SpeakBubbleIcon } from "../../../assets/images/icons/speak-bubble.svg";
import { ReactComponent as AiryLogo } from "../../../assets/images/logo/airy_primary_rgb.svg";
import { ReactComponent as ChevronDown } from "../../../assets/images/icons/chevron-down.svg";

type TopBarProps = {
  user: User;
  isAuthSuccess: string;
  first_name: string;
  last_name: string;
  organization_name: string;
  isAdmin: boolean;
};

const LOGOUT_ROUTE = "/logout";

const TopBarComponent = (props: TopBarProps) => {
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
                      <ShortcutIcon className={styles.dropdownIcon} />
                      <span>Contact us</span>
                    </a>
                    <a
                      href="https://airy.co/faq"
                      target="_blank"
                      className={styles.dropdownLine}
                    >
                      <ShortcutIcon className={styles.dropdownIcon} />
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
                      <div className={styles.accountHint}>
                        {props.organization_name}
                      </div>
                    </div>
                    <div
                      className={`${styles.dropHint} ${
                        isAccountDropdownOn ? styles.dropHintOpen : ""
                      }`}
                    >
                      <ChevronDown className={styles.chevronDown} />
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
                        <SpeakBubbleIcon className={styles.dropdownIcon} />
                        <span>Go to Inbox</span>
                      </a>
                    ) : (
                      <a
                        href="https://admin.airy.co"
                        target="_blank"
                        className={styles.dropdownLine}
                      >
                        <CogIcon className={styles.dropdownIcon} />
                        <span>Go to Admin</span>
                      </a>
                    )}
                    <Link to={LOGOUT_ROUTE} className={styles.dropdownLine}>
                      <LogoutIcon className={styles.dropdownIcon} />
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

export function getOrganizationName(user: User) {
  return (
    (user.organizations &&
      user.organizations.length &&
      user.organizations[0].name) ||
    ""
  );
}

const mapStateToProps = state => {
  return {
    user: state.data.user,
    first_name: state.data.user.first_name,
    last_name: state.data.user.last_name,
    organization_name: getOrganizationName(state.data.user),
    isAuthSuccess: state.data.user.refresh_token
  };
};

export const TopBar = withRouter(connect(mapStateToProps)(TopBarComponent));
