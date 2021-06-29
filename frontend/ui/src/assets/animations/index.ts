import {Dispatch, SetStateAction} from 'react';

export const useAnimation = (
  useState: Dispatch<SetStateAction<boolean>>,
  currentState: boolean,
  fadeState: Dispatch<SetStateAction<boolean>>,
  timeOut: number
) => {
  setTimeout(() => useState(!currentState), timeOut);
  setTimeout(() => fadeState(true), timeOut);
  fadeState(false);
};
