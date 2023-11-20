import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';


import { ChakraProvider } from '@chakra-ui/react'
import Home from './pages/Home';
import store from './store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <Home />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
