import {createRoot} from 'react-dom/client'
import './index.css'
import Home from './pages/Home.tsx'
import {BrowserRouter, Route, Routes} from "react-router";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
        </Routes>
    </BrowserRouter>,
)
