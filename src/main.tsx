import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import { HelmetProvider } from "react-helmet-async";
import {Provider} from 'react-redux';
import store from './redux/store.ts';
createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    {/* not all the state of the app is managed by redux, 
    so we need to wrap the app with provider to make the store available
     to all components */}
    <Provider store={store}>
      {/* <HelmetProvider> */}
        <App />
      {/* </HelmetProvider> */}
    </Provider>
  </StrictMode>,
)
