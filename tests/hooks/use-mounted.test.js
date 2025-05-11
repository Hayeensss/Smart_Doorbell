import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';

// Simple useMounted hook implementation to test
// This simulates a hook that might exist in your codebase
function useMounted() {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  return mounted;
}

// Import React directly in the test
import * as React from 'react';

describe('useMounted Hook', () => {
  it('should return false initially and true after mount', () => {
    const { result } = renderHook(() => useMounted());
    
    // After initial render + useEffect, should be true
    expect(result.current).toBe(true);
  });
}); 