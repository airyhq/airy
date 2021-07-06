import React from 'react';
import {RenderProp} from '../../config';

type Props = {
  render: RenderProp;
};

const HeaderBarProp = (props: Props) => {
  return props.render();
};

export default HeaderBarProp;
