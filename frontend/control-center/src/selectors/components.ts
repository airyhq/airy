import {StateModel} from '../reducers';
import {useSelector} from 'react-redux';
import {Source, ComponentInfo} from 'model';

export const useCurrentComponentForSource = (source: Source) => {
  const componentInfoArr: [string, ComponentInfo][] = useSelector((state: StateModel) =>
    Object.entries(state.data.catalog).filter(item => item[1].source === source)
  )

  const componentInfoArrFlat = componentInfoArr.flat() as [string, ComponentInfo];
  const [name] = componentInfoArrFlat;

  return {name: name, ...componentInfoArrFlat[1]};
};
