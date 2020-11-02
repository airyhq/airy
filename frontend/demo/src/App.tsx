import React from "react";

import { AiryLoader } from "components/src";

import styles from "./index.module.scss";

const App = () => {
  return (
    <div className={styles.container}>
      <AiryLoader />
    </div>
  );
};

export default App;
