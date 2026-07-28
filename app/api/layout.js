export const metadata = {
    title: 'GlamWigs GH',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body style={{ fontFamily: 'Arial, sans-serif', margin: 0, backgroundColor: '#fdf2f8' }}>
                <nav style={{ backgroundColor: '#be185d', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                    <a href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>GlamWigs GH</a>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Shop</a>
                        <a href="/checkout" style={{ color: 'white', textDecoration: 'none' }}>Cart</a>
                        <a href="/admin" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>Admin</a>
                    </div>
                </nav>
                {children}
            </body>
        </html>
    )
}