/* eslint-disable @typescript-eslint/no-explicit-any */
import $ from 'jquery';

/* اجعل jQuery و $ متاحَيْن على window قبل أيّ شيء آخر */
if (!(window as any).jQuery) {
  (window as any).jQuery = $;
  (window as any).$ = $;
}

/* Bootstrap bundle – يحتوي modal / tooltip الضروريّين لـ Summernote */
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default $; // قد تحتاجه إذا أردت استخدامه صراحةً
