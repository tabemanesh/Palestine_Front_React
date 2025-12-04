/// <reference types="vite/client" />

/**
 * تعریف متغیرهای محیطی Vite
 * همه متغیرها باید با VITE_ شروع شوند
 */
interface ImportMetaEnv {
  /**
   * آدرس پایه API
   
   */
  readonly VITE_API_BASE_URL: string;

  /**
   * محیط اجرای برنامه
   */
  readonly VITE_APP_ENV: 'development' | 'production' ;

  /**
   * حالت اجرا (توسط Vite تنظیم می‌شود)
   */
  readonly MODE: string;

  /**
   * آیا در حالت Development است؟ (توسط Vite تنظیم می‌شود)
   */
  readonly DEV: boolean;

  /**
   * آیا در حالت Production است؟ (توسط Vite تنظیم می‌شود)
   */
  readonly PROD: boolean;

  /**
   * آیا در حالت SSR است؟ (توسط Vite تنظیم می‌شود)
   */
  readonly SSR: boolean;

  /**
   * Base URL برنامه (توسط Vite تنظیم می‌شود)
   */
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * تعریف ماژول‌های استاتیک
 */
declare module '*.svg' {
  import type * as React from 'react';
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}

declare module '*.png' {
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

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.woff' {
  const src: string;
  export default src;
}

declare module '*.woff2' {
  const src: string;
  export default src;
}

declare module '*.ttf' {
  const src: string;
  export default src;
}

declare module '*.eot' {
  const src: string;
  export default src;
}

declare module '*.otf' {
  const src: string;
  export default src;
}

declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.json' {
  const value: unknown;
  export default value;
}