import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ContextProvider, { Context } from "./context/context";
import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './index.css';

const ChatLayout = () => {
    const { user } = useContext(Context);
    if (!user) return <Navigate to="/login" replace />;
    return (
        <div className="app-layout">
            <Sidebar />
            <Main />
        </div>
    );
};

const App = () => (
    <ContextProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/*"        element={<ChatLayout />} />
            </Routes>
        </BrowserRouter>
    </ContextProvider>
);

export default App;
