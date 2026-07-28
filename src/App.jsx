import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Checkout from './components/Checkout'
import Admin from './components/Admin'

export default function App() {
    const [cart, setCart] = useState([])

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                )
            }
            return [...prev, { ...product, qty: 1 }]
        })
    }

    const clearCart = () => setCart([])

    return (
        <Router>
            <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#fdf2f8', minHeight: '100vh' }}>
                <nav style={{ backgroundColor: '#be185d', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                    <a href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>GlamWigs GH</a>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Shop</a>
                        <a href="/checkout" style={{ color: 'white', textDecoration: 'none' }}>Cart ({cart.length})</a>
                        <a href="/admin" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>Admin</a>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<Home cart={cart} addToCart={addToCart} />} />
                    <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </div>
        </Router>
    )
}