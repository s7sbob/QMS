/* eslint-disable @typescript-eslint/no-explicit-any */
import $ from 'jquery';

if (!(window as any).jQuery) {
  (window as any).jQuery = $;
  (window as any).$ = $;
}

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default $;
