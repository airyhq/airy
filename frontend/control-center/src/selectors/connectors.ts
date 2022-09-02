import {StateModel} from '../reducers';
import {useSelector} from 'react-redux';
import {Source} from 'model';

export const useCurrentConnectorForSource = (source: Source) => {
  const connectors = useSelector((state: StateModel) => state.data.connector);
  const connectorInfoArr = Object.entries(connectors).filter(item => item[0].includes(source));

  const connectorInfoArrFlat = connectorInfoArr.flat() as [string, {[key: string]: string}];
    
    
  return {...connectorInfoArrFlat[1]};
};