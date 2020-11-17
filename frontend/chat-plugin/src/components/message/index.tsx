import { h } from "preact";

type Props = {
  render: any;
};

const MessageProp = (props: Props) => {
  return <div>{props.render()}</div>;
};

export default MessageProp;
