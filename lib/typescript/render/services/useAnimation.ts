import {Dispatch, SetStateAction} from 'react';

export const useAnimation = (
  currentState: boolean,
  setState: Dispatch<SetStateAction<boolean>>,
  animationState: Dispatch<SetStateAction<boolean>>,
  timeOut: number
) => {
  setTimeout(() => setState(!currentState), timeOut);
  setTimeout(() => animationState(true), timeOut);
  animationState(false);
};
