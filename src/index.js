import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'c/app';
import store from './store'
import { Provider } from 'react-redux'

const MOUNT_NODE = document.getElementById('root');
const root = createRoot(MOUNT_NODE);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
