//@ts-nocheck
import React from 'react'

import { BrowserRouter } from 'react-router-dom'
import { Button, LinkButton, HrefButton, ErrorMessage, ErrorNotice, TopBar } from 'components'

import styles from './index.module.scss'

const App = () => {

  return (
    <>
      <h1 className={styles.title}>Airy Components Library Showcase</h1>
      <div className={styles.main}>
        <h2 className={styles.sectionTitle}>Alerts</h2>
        <div className={styles.section}>
          <div className={styles.item}>
            <h3>Error message</h3>
            {/* <Provider store={store}>
              <BrowserRouter>
                <TopBar isAdmin={true} />
              </BrowserRouter>
            </Provider> */}
            <ErrorMessage text="This in an error message" />
          </div>
          <div className={styles.item}>
            <h3>Error notice warning</h3>
            <ErrorNotice theme="warning">
              <p>This in an warning message</p>
            </ErrorNotice>
          </div>
          <div className={styles.item}>
            <h3>Error notice error</h3>
            <ErrorNotice theme="error">
              <p>This in an error message"</p>
            </ErrorNotice>
          </div>

        </div>
        <h2 className={styles.sectionTitle}>Buttons</h2>
        <div className={styles.section}>
          <div className={styles.item}>
            <h3>Normal</h3>
            <Button styleVariant="normal" type="submit" onClick={() => (alert("Button Pressed"))}>Button</Button>
          </div>
          <div className={styles.item}>
            <h3>Small</h3>
            <Button styleVariant="small" type="submit" onClick={() => (alert("Button Pressed"))}>Button</Button>
          </div>
          <div className={styles.item}>
            <h3>Outline normal</h3>
            <Button styleVariant="outline" type="submit" onClick={() => (alert("Button Pressed"))}>Button</Button>
          </div>
          <div className={styles.item}>
            <h3>Outline big</h3>
            <Button styleVariant="outline-big" type="submit" onClick={() => (alert("Button Pressed"))}>Button</Button>
          </div>
          <div className={styles.item}>
            <h3>Warning</h3>
            <Button styleVariant="warning" type="submit" onClick={() => (alert("Button Pressed"))}>Button</Button>
          </div>
          <div className={styles.item}>
            <h3>Text</h3>
            <Button styleVariant="text" type="submit" onClick={() => (alert("Button Pressed"))}>Button</Button>
          </div>
          <div className={styles.item}>
            <h3>Link</h3>
            <LinkButton onClick={() => (alert("Button Pressed"))}>Button</LinkButton>
          </div>
          <div className={styles.item}>
            <h3>Href</h3>
            <BrowserRouter>
              <HrefButton href="buttonTest">Button</HrefButton>
            </BrowserRouter>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
