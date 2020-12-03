import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';

import {ErrorNotice, Input, Button} from '@airyhq/components';

import {loginViaEmail} from '../../actions/user';

import logo from '../../assets/images/logo/airy_primary_rgb.svg';
import styles from './index.module.scss';

const mapDispatchToProps = {
  loginViaEmail,
};

const connector = connect(null, mapDispatchToProps);

type LoginConnectProps = {} & ConnectedProps<typeof connector> & RouteComponentProps;

const Login = (props: LoginConnectProps) => {
  const [credentialError, setCredentialError] = useState(false);

  const handleLogin = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    props
      .loginViaEmail({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      })
      .then(() => {
        props.history.push('/');
      })
      .catch(() => {
        setCredentialError(true);
      });
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
          <h1>Log in to Airy</h1>
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
              fontClass="font-base"></Input>
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

export default connector(Login);
