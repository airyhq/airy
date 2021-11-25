import React, {useState, useEffect} from 'react';

declare global {
  interface Window {
    FB: {init: any; getLoginStatus: any; login: any; api: any; logout: any};
    fbAsyncInit: any;
  }
}

export const FacebookLogin = ({fetchDataFromFbLoginSDK}) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [name, setName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [pageId, setPageId] = useState('');
  const [instagramAccountId, setInstagramAccountId] = useState('');

  useEffect(() => {

    if(isLoggedin && !name && !accessToken && !pageId && instagramAccountId){
      fetchData()
    } else {
      setIsLoggedin(false)
    }

  }, [isLoggedin])

  const login = () => {
    window.FB.login(function (response) {
      console.log('FB LOGIN response', response);
      if (response.authResponse) {
        setIsLoggedin(true);
        fetchData();
      } else {
        console.log('User cancelled login or did not fully authorize.');
        setIsLoggedin(false);
      }
      // if (response.status === 'connected' || response.status === 'unknown') {
      // } else {
      //   window.FB.login(function (response) {
      //     console.log('login response', response);
      //   });
      // }
    });
  };

  const logout = () => {
    window.FB.logout(function (response) {
      console.log('logout response', response);
      setIsLoggedin(false);
      //document.location.reload();
    });
  };

  const fetchData = () => {
    window.FB.api('/me/accounts/?fields=name,id,access_token,instagram_business_account', function (response) {
      console.log('fetch data', response);
      const name = response.data[0].name;
      const accessToken = response.data[0].access_token;
      const pageId = response.data[0].id;
      const instagramAccountId = response.data[0].instagram_business_account.id;
      setName(name);
      setAccessToken(accessToken);
      setInstagramAccountId(instagramAccountId);
      setPageId(pageId);

      fetchDataFromFbLoginSDK(name, accessToken, pageId, instagramAccountId)

      setIsLoggedin(true);

      // window.FB.getLoginStatus(function(response) {
      //   statusChangeCallback(response);
      // });
    });
  };

  // function statusChangeCallback(response) {
  //   console.log('statusChangeCallback', response);
  //   if (response.status === 'connected') {
  //     fetchData();
  //   } else {
  //     console.log('statusChangeCallback - not connected');
  //   }
  // }

  useEffect(() => {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: '1117544754977108',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v12.0',
      });

      // window.FB.getLoginStatus(response => {
      //   statusChangeCallback(response);
      // });
    };

    (function (d, s, id) {
      let js;
      let fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src =
        'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0&appId=1117544754977108&autoLogAppEvents=1';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  return (
    <>
     <button onClick={login}>{isLoggedin ? 'LOG IN' : 'LOGGED IN'} WITH FB</button>
    </>
  );
};
