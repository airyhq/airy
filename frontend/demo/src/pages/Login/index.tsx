import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {ErrorNotice, Input, Button} from 'components/src';
import logo from 'components/src/assets/images/logo/airy_primary_rgb.svg';
import styles from './index.module.scss';

const Login = props => {
  
  const [credentialError, setCredentialError] = useState(false);

  const handleLogin = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // props.loginViaEmail(formData.get('email'), formData.get('password')).then(success => {
    //   return success ? props.history.push(MESSENGER_ROUTE) : setCredentialError(true);
    // });
  };

  const handleEmailChange = () => {
    setCredentialError(false);
  };

  const handlePwdChange = () => {
    setCredentialError(false);
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.formWrapper}>
        <header>
          <img src={logo} alt="Airy Logo" width={128} />
          <h1>Log in to Airy Cloud</h1>
        </header>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.inputFields}>
            <Input
              label="Email"
              placeholder="Email"
              name="email"
              type="email"
              onChange={handleEmailChange}
              required={true}
              height={32}
              fontClass="font-base"
            />
            <Input
              label="Password"
              placeholder="Password"
              name="password"
              type="password"
              height={32}
              minLength={6}
              onChange={handlePwdChange}
              required={true}
              fontClass="font-base">              
            </Input>
            {credentialError && <ErrorNotice theme="error">You have entered an invalid email or password.</ErrorNotice>}
          </div>
          <Button styleVariant="normal" type="submit">
            Login
          </Button>
        </form>        
      </div>
      <p className={styles.footer}>
        By signing up, you agree to our{' '}
        <a href="https://airy.co/terms-of-service" target="_blank">
          Terms and Conditions
        </a>{' '}
        and{' '}
        <a href="https://airy.co/privacy-policy" target="_blank">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};


export default withRouter(Login);
