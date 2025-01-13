import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store'; // Import the store and persistor
import { PersistGate } from 'redux-persist/integration/react';
import ErrorBoundary from './components/ErrorBoundary.jsx';  // Import the ErrorBoundary component

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>  {/* Wrap the app with PersistGate */}
        <ErrorBoundary>  {/* Wrap the app with the ErrorBoundary */}
          <App />
          <Toaster />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
