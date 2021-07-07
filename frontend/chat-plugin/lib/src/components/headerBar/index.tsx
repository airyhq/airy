import {RenderProp} from '../../config';

type Props = {
  render: RenderProp;
};

const HeaderBarProp = (props: Props) => props.render();

export default HeaderBarProp;
