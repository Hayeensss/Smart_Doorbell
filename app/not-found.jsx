import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2>404 - Page Not Found</h2>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link href="/"
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          textDecoration: 'none',
          backgroundColor: '#0070f3',
          color: 'white',
          borderRadius: '5px'
        }}
      >
        Go back to Home
      </Link>
    </div>
  );
} 