import React from 'react';
import {Lottie} from '@crello/react-lottie';
import {AiryAnimationLoaderData} from './data';
import styles from './style.module.scss';

export const AiryLoader = () => (
  <div className={styles.wrapper}>
    <Lottie
      config={{
        loop: true,
        autoplay: true,
        animationData: AiryAnimationLoaderData,
      }}
      height="400px"
      width="400px"
    />
  </div>
);
