import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
    HomePage,
    LoginPage,
    HistoryPage,
    RegisterPage,
    ImportExportPage,
    LabelConfigPage,
    TimerConfigPage,
    NotFoundPage
} from "./pages/";
import MainLayout from "./components/MainLayout";

import './index.css';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/history" element={<HistoryPage/>}/>
                    <Route path="/data" element={<ImportExportPage/>}/>

                    <Route path="/settings">
                        <Route path="labels" element={<LabelConfigPage/>}/>
                        <Route path="timers" element={<TimerConfigPage/>}/>
                    </Route>

                    <Route path="/auth">
                        <Route path="register" element={<RegisterPage/>}/>
                        <Route path="login" element={<LoginPage/>}/>
                    </Route>
                </Route>

                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)
