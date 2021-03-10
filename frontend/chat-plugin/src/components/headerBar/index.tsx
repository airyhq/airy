import React from 'react';
import {RenderProp} from '../../config';

type Props = {
  render: RenderProp;
};

const HeaderBarProp = (props: Props) => {
  return <div>{props.render()}</div>;
};

export default HeaderBarProp;
