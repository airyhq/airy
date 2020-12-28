import {h} from 'preact';

type Props = {
  render: any;
};

const InputBarProp: React.FC<Props> = (props: Props): JSX.Element => {
  return <div>{props.render()}</div>;
};

export default InputBarProp;
