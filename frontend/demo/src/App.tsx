import React from "react";

import { AiryLoader } from "@airyhq/components";

import styles from "./index.module.scss";

const App = () => {
  return (
    <div className={styles.container}>
      <AiryLoader />
    </div>
  );
};

export default App;
