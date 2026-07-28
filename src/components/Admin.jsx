import { useState, useEffect } from 'react'

export default function Admin() {
    const [isAuth, setIsAuth] = useState(false)
    const [password, setPassword] = useState("")
    const [orders, setOrders] = useState([])

    // Uses the variable from .env.local
    const SECRET = import.meta.env.VITE_ADMIN_SECRET || "supersecretpassword123"

    const login = () => {
        if (password === SECRET) setIsAuth(true)
        else alert("Wrong password")
    }

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/get-orders", {
                headers: { "x-admin-secret": SECRET },
            })
            const data = await res.json()
            setOrders(data)
        } catch (error) {
            console.error("Failed to fetch orders", error)
        }
    }

    const markAsViewed = async (orderId) => {
        await fetch("/api/view-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-admin-secret": SECRET
            },
            body: JSON.stringify({ orderId }),
        })
        setOrders(orders.filter(o => o.id !== orderId))
    }

    useEffect(() => {
        if (isAuth) fetchOrders()
        const interval = setInterval(() => {
            if (isAuth) fetchOrders()
        }, 10000) // Auto-refresh every 10 seconds
        return () => clearInterval(interval)
    }, [isAuth])

    if (!isAuth) {
        return (
            <div style={{ maxWidth: "300px", margin: "100px auto", padding: "30px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: 'white' }}>
                <h2>Admin Login</h2>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "15px", boxSizing: 'border-box' }} />
                <button onClick={login} style={{ width: "100%", padding: "10px", backgroundColor: "#be185d", color: "white", border: "none", cursor: "pointer" }}>Enter</button>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: "800px", margin: "30px auto", padding: "20px" }}>
            <h2>🔔 New Unviewed Orders ({orders.length})</h2>
            {orders.length === 0 ? <p style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>No new orders waiting.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {orders.map(order => (
                        <div key={order.id} style={{ border: "1px solid #fcd34d", backgroundColor: "#fffbeb", padding: "20px", borderRadius: "8px", boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                                <h3 style={{ margin: 0 }}>{order.id}</h3>
                                <button onClick={() => markAsViewed(order.id)} style={{ padding: "8px 15px", backgroundColor: "#16a34a", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                                    ✅ Mark as Handled
                                </button>
                            </div>
                            <p><strong>Name:</strong> {order.customer.name}</p>
                            <p><strong>Phone:</strong> {order.customer.phone}</p>
                            <p><strong>Location:</strong> {order.customer.location}</p>
                            <p><strong>Time:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <hr style={{ border: 0, borderTop: '1px solid #fde68a', margin: '10px 0' }} />
                            <ul style={{ paddingLeft: '20px' }}>
                                {order.cart.map(item => (
                                    <li key={item.id}>{item.name} (x{item.qty}) - <strong>GHS {item.price * item.qty}</strong></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}