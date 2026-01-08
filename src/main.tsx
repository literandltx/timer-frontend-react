import {createRoot} from 'react-dom/client'
import './index.css'
import Home from './pages/Home.tsx'
import {BrowserRouter, Route, Routes} from "react-router";
import History from "./pages/History.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/history" element={<History/>}/>
        </Routes>
    </BrowserRouter>,
)
