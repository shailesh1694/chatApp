import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux';
import store from "./store/store"
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { StrictMode } from 'react';
import '../node_modules/react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <ToastContainer />
                <App />
            </Provider>
        </BrowserRouter>
    </StrictMode>
)
