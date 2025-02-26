declare module 'js-cookie' {
    interface CookiesStatic<T = object> {
      get: (name: string) => string | undefined;
      set: (name: string, value: string, options?: any) => void;
      remove: (name: string, options?: any) => void;
      // ... يمكنك إضافة تعريفات أخرى حسب الحاجة
    }
  
    const Cookies: CookiesStatic;
    export default Cookies;
  }
  