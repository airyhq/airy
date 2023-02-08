import React from 'react';
import {useTranslation} from 'react-i18next';
import {Source} from 'model';

export const DescriptionComponent = (props: {source: string}) => {
  const {t} = useTranslation();
  const {source} = props;

  const translationKey = source + 'Description';
  const translation = t(translationKey);

  if (translation !== translationKey) return <>{translation}</>;
  return <>{source.charAt(0).toUpperCase() + source.slice(1) + ' Description'}</>;
};

export const getDescriptionSourceName = (source: Source) => source.replaceAll('.', '');
