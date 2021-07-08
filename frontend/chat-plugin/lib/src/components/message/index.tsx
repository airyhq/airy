import React from 'react';

type Props = {
  render: any;
};

const MessageProp = (props: Props) => {
  return <div>{props.render()}</div>;
};

export default MessageProp;
