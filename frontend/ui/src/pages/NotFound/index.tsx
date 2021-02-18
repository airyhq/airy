import React, {useEffect} from 'react';
import Wrapper from '../../components/Wrapper';
import {setPageTitle} from '../../services/pageTitle';

const NotFound = () => {
  useEffect(() => {
    setPageTitle('Page not found');
  }, []);

  return (
    <Wrapper>
      <div>Oops! We couldn&#39;t find that here.</div>
    </Wrapper>
  );
};

export default NotFound;
