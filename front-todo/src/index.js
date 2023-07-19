import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { store } from './app/store'
import {GoogleOAuthProvider} from '@react-oauth/google';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <GoogleOAuthProvider clientId="59866668171-2776qr9s2j4gt9u4k902jg2r9h02av15.apps.googleusercontent.com">
      <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
