import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { PrimeReactProvider } from 'primereact/api'; // Add this import
import { RestaurantProfileProvider } from '../src/Components/Restaurant/RestaurantProfileContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PrimeReactProvider value={{ hideOverlaysOnDocumentScrolling: true }}>
      <Provider store={store}>
        <BrowserRouter>
          <RestaurantProfileProvider>
            <App />
          </RestaurantProfileProvider>
        </BrowserRouter>
      </Provider>
    </PrimeReactProvider>
  </React.StrictMode>
);

reportWebVitals();