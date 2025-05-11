import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with correct text', async () => {
    render(<Button>Click Me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click Me' });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button', { name: 'Click Me' });
    
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Destructive Button</Button>);
    
    const button = screen.getByRole('button', { name: 'Destructive Button' });
    expect(button).toHaveClass('bg-destructive');
  });

  it('applies size classes correctly', () => {
    render(<Button size="sm">Small Button</Button>);
    
    const button = screen.getByRole('button', { name: 'Small Button' });
    expect(button).toHaveClass('h-9');
  });

  it('applies custom className', () => {
    render(<Button className="test-class">Custom Class Button</Button>);
    
    const button = screen.getByRole('button', { name: 'Custom Class Button' });
    expect(button).toHaveClass('test-class');
  });

  it('forwards refs correctly', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Ref Button</Button>);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current.tagName).toBe('BUTTON');
  });

  it('renders as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="#test">Link Button</a>
      </Button>
    );
    
    const link = screen.getByRole('link', { name: 'Link Button' });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '#test');
  });
}); 