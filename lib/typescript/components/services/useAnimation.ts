import {Dispatch, SetStateAction} from 'react';

export const useAnimation = (
  currentState: boolean,
  setState: Dispatch<SetStateAction<boolean>>,
  animationState: Dispatch<SetStateAction<boolean>>,
  timeOut: number
) => {
  new Promise(resolve => {
    !currentState && setState(true);
    animationState(!currentState);
    resolve(true);
  }).then(() => {
    setTimeout(() => {
      setState(!currentState);
    }, timeOut);
  });
};
