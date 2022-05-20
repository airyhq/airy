import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import Wrapper from '../../components/Wrapper';
import {setPageTitle} from '../../services/pageTitle';

const NotFound = () => {
  const {t} = useTranslation();
  useEffect(() => {
    setPageTitle('Page not found');
  }, []);

  return (
    <Wrapper>
      <div>{t('notFound')}</div>
    </Wrapper>
  );
};

export default NotFound;
