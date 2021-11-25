import React, {useState, useEffect} from 'react';

export const FacebookLogin = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);

  const onLoginClick = () => {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: '1117544754977108',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v12.0',
      });

      window.FB.getLoginStatus(response => {
        console.log('login status response', response);
        window.FB.login(function (response) {
          if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            window.FB.api('/me/accounts/?fields=name,id,access_token,instagram_business_account', function (response) {
              console.log('response /me/accounts', response)
              //console.log('Good to see you, ' + response.name + '.');
            });
          } else {
            console.log('User cancelled login or did not fully authorize.');
          }
          // if (response.status === 'connected' || response.status === 'unknown') {
          // } else {
          //   window.FB.login(function (response) {
          //     console.log('login response', response);
          //   });
          // }
        });
      });
    };
  };

  const logout = () => {
    window.FB.logout(function (response) {
      console.log('logout response', response);
    });
  };

  useEffect(() => {
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: '1117544754977108',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v12.0',
      });

      window.FB.getLoginStatus(response => {
        console.log('login status response', response);
        window.FB.login(function (response) {
          if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            window.FB.api('/me/accounts/?fields=name,id,access_token,instagram_business_account', function (response) {
              console.log('response /me/accounts', response)
              //console.log('Good to see you, ' + response.name + '.');
            });
          } else {
            console.log('User cancelled login or did not fully authorize.');
          }
          // if (response.status === 'connected' || response.status === 'unknown') {
          // } else {
          //   window.FB.login(function (response) {
          //     console.log('login response', response);
          //   });
          // }
        });
      });
    };
    
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
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
      <div
        className="fb-login-button"
        data-width=""
        data-size="large"
        data-button-type="login_with"
        data-layout="default"
        data-auto-logout-link="false"
        data-use-continue-as="false"
        onClick={onLoginClick}
        ></div>

      <button onClick={logout}>LOGOUT</button>
    </>
  );
};
