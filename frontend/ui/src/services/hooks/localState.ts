import {SetStateAction, Dispatch, useEffect, useState} from 'react';

export const useLocalState = <S>(key: string, defaultValue: S): [S, Dispatch<SetStateAction<S>>] => {
  const [value, setValue] = useState(() => {
    const localValue = window.localStorage.getItem(key);
    return localValue !== null ? JSON.parse(localValue) as S : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
};

export const getUseLocalState =
  (prefix: string) =>
  <S>(key: string, defaultValue: S) =>
    useLocalState<S>(`${prefix}.${key}`, defaultValue);
