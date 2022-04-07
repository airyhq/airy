/// <reference types="react" />

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

interface CustomSVGRProps {
  title?: string; // https://react-svgr.com/docs/options/#title
}

type SvgrComponent = React.FunctionComponent<React.SVGAttributes<SVGElement> & CustomSVGRProps>;

declare module '*.svg' {
  const src: string;
  export default src;
  export const ReactComponent: SvgrComponent;
}

declare module '*.css' {
  const classes: {readonly [key: string]: string};
  export default classes;
}

declare module '*.scss' {
  const content: {[className: string]: string};
  export = content;
}

declare module '*.json';

declare type Dictionary<T> = {
  [key: string]: T;
};
