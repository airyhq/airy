import {h} from 'preact';

type Props = {
  render: any;
};

const InputBarProp = (props: Props) => {
  return <div>{props.render()}</div>;
};

export default InputBarProp;
