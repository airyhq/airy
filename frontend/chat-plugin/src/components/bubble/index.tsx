import {h} from 'preact'
import {RenderProp} from '../../config';

type Props = {
  render: RenderProp;
};

const BubbleProp = (props: Props) => {
  return <div>{props.render()}</div>;
};

export default BubbleProp;
