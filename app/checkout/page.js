'use client';
import { useState, useEffect } from 'react';

export default function Checkout() {
    const [cart, setCart] = useState([]);
    const [customer, setCustomer] = useState({ name: "", phone: "", location: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem('wigCart') || '[]'));
    }, []);

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return alert("Your cart is empty!");
        setLoading(true);

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart, customer }),
            });
            const data = await res.json();

            window.open(data.waLink, "_blank");
            alert("Order sent! Please send the message in WhatsApp to confirm.");

            setCart([]);
            localStorage.removeItem('wigCart');
            setCustomer({ name: "", phone: "", location: "" });
        } catch (err) {
            alert("Error placing order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '40px auto', backgroundColor: 'white', padding: '30px', borderRadius: '10px' }}>
            <h2>Complete Order</h2>
            {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                    <span>{item.name} (x{item.qty})</span>
                    <span>GHS {item.price * item.qty}</span>
                </div>
            ))}
            <h3 style={{ textAlign: 'right' }}>Total: GHS {total}</h3>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Full Name *</label>
                    <input required value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Phone Number *</label>
                    <input required value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="024 XXX XXXX" style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Delivery Location *</label>
                    <input required value={customer.location} onChange={(e) => setCustomer({ ...customer, location: e.target.value })} style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                    {loading ? "Processing..." : "Place Order via WhatsApp"}
                </button>
            </form>
        </div>
    );
}