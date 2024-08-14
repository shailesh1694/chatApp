import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "../node_modules/bootstrap-icons/font/bootstrap-icons.min.css"
import { Navigate, Route, Routes } from 'react-router-dom'
import PrivateRoutes from './components/PrivateRoutes'
import PublicRoutes from './components/PublicRoutes'
import Login from "./pages/Login"
import Register from "./pages/Register"
import Chat from "./pages/Chat"



const App = () => {

    return (
        <Routes>
            <Route
                path='/'
                element={
                    <PrivateRoutes>
                        <Chat />
                    </PrivateRoutes>
                }
            />
            <Route
                path='/login'
                element={
                    <PublicRoutes>
                        <Login />
                    </PublicRoutes>
                } />
            <Route
                path='/register'
                element={
                    <PublicRoutes>
                        <Register />
                    </PublicRoutes>
                } />

            <Route path="*" element={<p>404 Not found</p>} />
        </Routes>
    )
}

export default App