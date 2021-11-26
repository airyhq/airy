import React, {useState, useEffect} from 'react';
import {env} from '../../../env';
import {ErrorNotice} from 'components/alerts/ErrorNotice';
import {ReactComponent as FbLoginIcon} from 'assets/images/icons/fb-login.svg';
import styles from './index.module.scss';

interface FacebookLoginProps {
  fetchIgChannelDataFromFbLoginSDK?: (
    name: string,
    accessToken: string,
    pageId: string,
    instagramAccountId: string
  ) => void;
  fetchFbChannelDataFromFbLoginSDK?: (name: string, accessToken: string, pageId: string) => void;
}

export const FacebookLogin = ({
  fetchIgChannelDataFromFbLoginSDK,
  fetchFbChannelDataFromFbLoginSDK,
}: FacebookLoginProps) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [authError, setAuthError] = useState<boolean | string>(false);

  const login = () => {
    if (isLoggedin) return;

    if (authError) setAuthError(false);

    window.FB.login(response => {
      if (response.authResponse) {
        setIsLoggedin(true);
        fetchData();
      } else {
        if (isLoggedin) setIsLoggedin(false);
        setAuthError('Login via Facebook failed because you cancelled the login process or did not fully authorize.');
      }
    });
  };

  const fetchData = () => {
    window.FB.api(
      '/me/accounts/?fields=name,id,access_token,pageinstagram_business_account',
      ({data: [{name, access_token, id, instagram_business_account}]}) => {
        const instagramAccountId = instagram_business_account?.id;

        if (!access_token || !id || (fetchIgChannelDataFromFbLoginSDK && !instagramAccountId)) {
          setAuthError('Something went wrong: please make sure you have granted the necessary permissions.');
          return;
        }

        if (fetchIgChannelDataFromFbLoginSDK && instagramAccountId)
          fetchIgChannelDataFromFbLoginSDK(name, access_token, id, instagramAccountId);

        if (fetchFbChannelDataFromFbLoginSDK) fetchFbChannelDataFromFbLoginSDK(name, access_token, id);
      }
    );
  };

  useEffect(() => {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: env.APP_ID,
        cookie: true,
        xfbml: false,
        status: true,
        version: 'v12.0',
      });
    };

    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0&appId=${env.APP_ID}&autoLogAppEvents=1`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  return (
    <>
      <button className={styles.facebookLogin} style={{cursor: isLoggedin ? 'not-allowed' : 'pointer'}} onClick={login}>
        <FbLoginIcon />
        <span>{isLoggedin ? 'Logged In' : 'Log In'} With Facebook</span>
      </button>

      {authError && <ErrorNotice theme="warning"> {authError} </ErrorNotice>}
    </>
  );
};
