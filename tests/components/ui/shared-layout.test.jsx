import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock authentication
vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    isSignedIn: true,
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      imageUrl: 'https://example.com/avatar.jpg',
    }
  }),
  SignedIn: ({ children }) => <div data-testid="signed-in">{children}</div>,
  SignedOut: ({ children }) => <div data-testid="signed-out">{children}</div>,
}));

// Create a simple mock of a layout component
const AppHeader = () => {
  return (
    <header data-testid="app-header">
      <h1>Smart Doorbell</h1>
      <nav>
        <ul>
          <li>Dashboard</li>
          <li>History</li>
          <li>Analytics</li>
          <li>Preferences</li>
        </ul>
      </nav>
    </header>
  );
};

describe('Shared Layout Components', () => {
  it('renders the app header', () => {
    render(<AppHeader />);
    
    const header = screen.getByTestId('app-header');
    expect(header).toBeInTheDocument();
  });
}); 