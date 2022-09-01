import {StateModel} from '../reducers';
import {useSelector} from 'react-redux';
import {Source, ComponentInfo} from 'model';

export const useCurrentComponentForSource = (source: Source) => {
  const catalog = useSelector((state: StateModel) => state.data.catalog);
  const componentInfoArr: [string, ComponentInfo][] = Object.entries(catalog).filter(item => item[1].source === source);

  const componentInfoArrFlat = componentInfoArr.flat() as [string, ComponentInfo];
  const [name] = componentInfoArrFlat;

  return {name: name, ...componentInfoArrFlat[1]};
};
