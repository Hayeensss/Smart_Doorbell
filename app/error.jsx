"use client";

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Something went wrong!</h2>
      <p>{error?.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={() => reset()}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          cursor: 'pointer',
          border: 'none',
          backgroundColor: '#0070f3',
          color: 'white',
          borderRadius: '5px'
        }}
      >
        Try again
      </button>
    </div>
  );
} 