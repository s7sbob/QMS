/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'js-cookie' {
  interface CookiesStatic<T = object> {
    get: (name: string) => string | undefined;
    set: (name: string, value: string, options?: any) => void;
    remove: (name: string, options?: any) => void;
  }

  const Cookies: CookiesStatic;
  export default Cookies;
}
