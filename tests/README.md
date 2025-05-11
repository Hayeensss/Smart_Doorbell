# Unit Testing with Vitest

This project uses Vitest for unit testing. Vitest is a fast unit-test framework powered by Vite.

## Running Tests

You can run tests using the following NPM scripts:

```bash
# Run all tests once
npm test

# Run tests in watch mode (will rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test File Structure

Tests are organized in the `tests` directory with a structure that mirrors the source code:

- `tests/` - Root test directory
  - `components/` - Tests for React components
    - `ui/` - Tests for UI components
  - `hooks/` - Tests for custom hooks
  - `utils.test.js` - Tests for utility functions

## Writing Tests

### Basic Test Structure

```js
import { describe, it, expect } from 'vitest';

// Function to test
function sum(a, b) {
  return a + b;
}

describe('Utils', () => {
  it('should add two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

### Testing React Components

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click Me</Button>);
    await user.click(screen.getByText('Click Me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Mocking

Vitest provides `vi.mock()` and `vi.fn()` for mocking:

```js
import { vi } from 'vitest';

// Mock a function
const mockFn = vi.fn();

// Mock a module
vi.mock('@/lib/api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mocked data' }))
}));
```

## Setup Files

The global test setup is in `setup-tests.js`, which includes:

- Jest DOM matchers
- Global mocks for browser APIs

## Test Configuration

The test configuration is in `vitest.config.js` and includes:

- JSDOM environment for React component testing
- Path aliases that match your project structure
- React plugin for handling JSX 