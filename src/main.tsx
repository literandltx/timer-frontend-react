import React from 'react';
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from "react-router-dom";

import {
    HomePage,
    HistoryPage,
    RegisterPage,
    LoginPage,
    LabelConfigPage,
    TimerConfigPage,
    NotFoundPage
} from "./pages/";

import './index.css'

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/history" element={<HistoryPage/>}/>

                <Route path="/auth/register" element={<RegisterPage/>}/>
                <Route path="/auth/login" element={<LoginPage/>}/>

                <Route path="/settings/labels" element={<LabelConfigPage/>}/>
                <Route path="/settings/timers" element={<TimerConfigPage/>}/>

                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)
