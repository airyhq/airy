import React from 'react';
import {TextTemplate} from './TextTemplate';
//import {Template} from 'httpclient';

type Props = {
  styleVariant?: 'small' | 'normal';
  template: any;
};

const RenderTemplate = ({styleVariant, template}: Props) => {
  const templateContent = JSON.parse(template.content) as any;
  switch (templateContent.blueprint) {
    case 'text':
      return <TextTemplate styleVariant={styleVariant} template={templateContent} isMember={true} />;

    default:
      return null;
  }
};

export default RenderTemplate;
