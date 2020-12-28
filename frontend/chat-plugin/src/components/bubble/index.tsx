import {h} from 'preact';
import {RenderProp} from '../../config';

type Props = {
  render: RenderProp;
};

const BubbleProp: React.FC<Props> = (props: Props): JSX.Element => {
  return <div>{props.render()}</div>;
};

export default BubbleProp;
