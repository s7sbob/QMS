import { Suspense } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { store } from './store/Store';
import Spinner from './views/spinner/Spinner';
import { UserProvider } from './context/UserContext';
import './utils/i18n';
import './_mockApis';
import $ from 'jquery';
(window as any).$ = $;
(window as any).jQuery = $;

import 'bootstrap/dist/js/bootstrap.bundle.min.js';   // ✅ يحوي modal+dropdown+tooltip

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Suspense fallback={<Spinner />}>
      <BrowserRouter>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    </Suspense>
  </Provider>,
);
