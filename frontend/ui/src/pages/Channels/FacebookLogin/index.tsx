import React, {useState, useEffect} from 'react';
import {ErrorNotice} from 'components/alerts/ErrorNotice';
import {Dropdown} from 'components/inputs/Dropdown';
import {ReactComponent as FbLoginIcon} from 'assets/images/icons/fb-login.svg';
import {AiryConfig} from '../../../AiryConfig';
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

interface FacebookPageData {
  name: string;
  access_token: string;
  id: string;
  instagram_business_account?: {id: string};
}

export const FacebookLogin = ({
  fetchIgChannelDataFromFbLoginSDK,
  fetchFbChannelDataFromFbLoginSDK,
}: FacebookLoginProps) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [authError, setAuthError] = useState<boolean | string>(false);
  const [multiplePagesData, setMultiplePagesData] = useState<FacebookPageData[] | null>(null);

  useEffect(() => {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: AiryConfig.FACEBOOK_APP_ID,
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
      js.src = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0&appId=${AiryConfig.FACEBOOK_APP_ID}&autoLogAppEvents=1`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

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

  const displayFetchDataError = () => {
    setAuthError('Something went wrong: please make sure you have granted the necessary permissions.');
    setIsLoggedin(false);
  };

  const fetchData = () => {
    window.FB.api('/me/accounts/?fields=name,id,access_token,page,instagram_business_account', ({data}) => {
      if (data.length > 1 && fetchIgChannelDataFromFbLoginSDK) {
        data = data.filter(page => page.instagram_business_account);
      }

      if (data.length === 0) {
        displayFetchDataError();
        return;
      }

      if (data.length > 1) {
        setMultiplePagesData(data);
        setIsLoggedin(true);
      }

      if (data.length === 1) {
        const [{name, access_token, id, instagram_business_account}] = data;
        const instagramAccountId = instagram_business_account?.id;

        if (!access_token || !id || (fetchIgChannelDataFromFbLoginSDK && !instagramAccountId)) {
          displayFetchDataError();
          return;
        }

        if (fetchIgChannelDataFromFbLoginSDK && instagramAccountId) {
          fetchIgChannelDataFromFbLoginSDK(name, access_token, id, instagramAccountId);
        }

        if (fetchFbChannelDataFromFbLoginSDK) fetchFbChannelDataFromFbLoginSDK(name, access_token, id);

        setIsLoggedin(true);
      }
    });
  };

  const selectPageToConnect = ({name, access_token, id, instagram_business_account}) => {
    if (fetchIgChannelDataFromFbLoginSDK) {
      fetchIgChannelDataFromFbLoginSDK(name, access_token, id, instagram_business_account.id);
    }

    if (fetchFbChannelDataFromFbLoginSDK) fetchFbChannelDataFromFbLoginSDK(name, access_token, id);

    setMultiplePagesData(null);
  };

  return (
    <>
      <button className={styles.facebookLogin} style={{cursor: isLoggedin ? 'not-allowed' : 'pointer'}} onClick={login}>
        <FbLoginIcon />
        <span>{isLoggedin ? 'Logged In' : 'Log In'} With Facebook</span>
      </button>

      {authError && <ErrorNotice theme="error"> {authError} </ErrorNotice>}

      {multiplePagesData && multiplePagesData.length > 0 && (
        <ErrorNotice theme="warning">
          {'Please select the Facebook Page you would like to connect:'}

          <Dropdown options={multiplePagesData} variant="borderless" onClick={selectPageToConnect} text=""></Dropdown>
        </ErrorNotice>
      )}
    </>
  );
};
