import {h} from 'preact';
import {RenderProp} from '../../config';

type Props = {
  render: RenderProp;
};

const HeaderBarProp: React.FC<Props> = (props: Props): JSX.Element => {
  return <div>{props.render()}</div>;
};

export default HeaderBarProp;
