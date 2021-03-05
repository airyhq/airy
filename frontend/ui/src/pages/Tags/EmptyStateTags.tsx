import React, {useState} from 'react';
import {Button} from '@airyhq/components';
import {ReactComponent as EmptyImage} from 'assets/images/empty-state/tags-empty-state.svg';

import SimpleTagForm from './SimpleTagForm';
import styles from './EmptyStateTags.module.scss';

const EmptyStateTags: React.FC = (): JSX.Element => {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.cardRaised}>
      <div className={styles.emptyStateTitle}>
        <h1>You don&#39;t have tags yet.</h1>
        <p>Tags provide a useful way to group related conversations together and to quickly filter and search them.</p>
        <EmptyImage />
        <Button onClick={() => setShow(true)}>Create a Tag</Button>
        {show && <SimpleTagForm onClose={() => setShow(false)} />}
      </div>
    </div>
  );
};

export default EmptyStateTags;
