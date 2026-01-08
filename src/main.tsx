import {BrowserRouter, Route, Routes} from "react-router-dom";
import {createRoot} from 'react-dom/client'
import './index.css'
import Home from './pages/Home.tsx'
import History from "./pages/History.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <div>test</div>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/history" element={<History/>}/>
            <Route path="*" element={<div>404 Not Found</div>}/>
        </Routes>
    </BrowserRouter>
)
