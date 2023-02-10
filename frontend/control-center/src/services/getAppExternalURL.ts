import {StateModel} from '../reducers';
import {useSelector} from 'react-redux';
import {FEAST_ROUTE} from '../routes/routes';
import {env} from '../env';

export const getAppExternalURL = (route: string): string => {
  const catalog = useSelector((state: StateModel) => state.data.catalog);
  const key = route.split('-')[0].replace('/', '').toLowerCase();
  switch (route) {
    case FEAST_ROUTE:
      if (catalog[key] && catalog[key].internalUI) return catalog[key].internalUI;
  }
  return `${env.API_HOST}/${key}/`;
};
