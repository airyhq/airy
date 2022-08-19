import React from 'react';
import {useTranslation} from 'react-i18next';
import {Source} from 'model';

export const DescriptionComponent = (props: {description: string}) => {
  const {t} = useTranslation();
  const {description} = props;

  return <>{t(description)}</>;
};

export const getDescriptionSourceName = (source: Source) => source.replaceAll('.', '');
