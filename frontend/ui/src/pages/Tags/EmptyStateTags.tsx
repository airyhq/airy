import React, {useState} from 'react';

import styles from './index.module.scss';
import {Button} from '@airyhq/components';
import {ReactComponent as EmptyImage} from 'assets/images/empty-state/tags-empty-state.svg';
import SimpleTagForm from './SimpleTagForm';

const EmptyStateTags: React.FC = (): JSX.Element => {
  const [show, setShow] = useState(false);

  return (
    <>
      {!show && (
        <div className={styles.cardRaised}>
          <div className={styles.emptyStateTitle}>
            <h1>You don&#39;t have tags yet.</h1>
            <p>
              Tags provide a useful way to group related conversations together and to quickly filter and search them.
            </p>
            <EmptyImage />
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
