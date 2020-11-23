import React, { useState } from "react";

import {ReactSVG} from 'react-svg';

import styles from "./index.module.scss";
import { Button, emptyImage } from "@airyhq/components";
import SimpleTagForm from "./SimpleTagForm";

const EmptyStateTags = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      {!show && (
        <div className={styles.cardRaised}>
          <div className={styles.emptyStateTitle}>
            <h1>You don't have tags yet.</h1>
            <p>
              Tags provide a useful way to group related conversations together
              and to quickly filter and search them.
            </p>
            <ReactSVG src={emptyImage} />
            <p>jsaldkjaslkdajslkdajslkdas</p>
            {/* <AccessibleSVG src={emptyImage} /> */}
            <Button onClick={() => setShow(true)}>Create a Tag</Button>
          </div>
        </div>
      )}
      {show && (
        <div className={styles.emptyStateTitle}>
          <SimpleTagForm onClose={() => setShow(false)} />
        </div>
      )}
    </>
  );
};

export default EmptyStateTags;
