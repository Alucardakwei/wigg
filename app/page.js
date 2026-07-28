'use client';
import { useState, useEffect } from 'react';

const wigs = [
    { id: 1, name: "Bone Straight Lace Front", price: 350, image: "https://images.unsplash.com/photo-1595959183082-7b570b7e1e2b?w=500&q=80" },
    { id: 2, name: "Deep Wave Bob Wig", price: 250, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80" },
    { id: 3, name: "Kinky Curly Full Lace", price: 450, image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=500&q=80" },
];

export default function Home() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('wigCart') || '[]');
        setCart(saved);
    }, []);

    const addToCart = (product) => {
        const updated = [...cart];
        const existing = updated.find(i => i.id === product.id);
        if (existing) existing.qty += 1;
        else updated.push({ ...product, qty: 1 });
        setCart(updated);
        localStorage.setItem('wigCart', JSON.stringify(updated));
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>Our Wig Collection 🇬🇭</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {wigs.map((wig) => (
                    <div key={wig.id} style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <img src={wig.image} alt={wig.name} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                        <div style={{ padding: '15px' }}>
                            <h3>{wig.name}</h3>
                            <p style={{ color: '#be185d', fontWeight: 'bold', fontSize: '20px' }}>GHS {wig.price}</p>
                            <button onClick={() => addToCart(wig)} style={{ backgroundColor: '#be185d', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}