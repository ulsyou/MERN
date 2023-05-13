import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/auth';
import { CartProvider } from './context/cart';

import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <CartProvider>
            <GlobalStyles>
                <App />
            </GlobalStyles>
        </CartProvider>
    </AuthProvider>,
);

reportWebVitals();
