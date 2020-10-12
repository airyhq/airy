/// <reference types="react" />
/// <reference types="react-dom" />

interface CustomNodeModule extends NodeModule {
  hot: any;
}

// Hot Module Replacement
declare var module: CustomNodeModule;

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

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.css' {
  const classes: {readonly [key: string]: string};
  export default classes;
}

declare module '*.scss' {
  const classes: {readonly [key: string]: string};
  export default classes;
}