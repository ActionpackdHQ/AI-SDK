import 'react';
import 'next';

declare module 'react' {
  interface JSX {
    IntrinsicElements: {
      [elemName: string]: {
        [key: string]: string | number | boolean | undefined;
      };
    };
  }
}

declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
    [key: string]: string | undefined;
  }
}
