import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'c/app';

const MOUNT_NODE = document.getElementById('root');
const root = createRoot(MOUNT_NODE);

root.render(<App />);
