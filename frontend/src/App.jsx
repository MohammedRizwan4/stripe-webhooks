import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';

function App() {

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="user" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
