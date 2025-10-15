# Testing Setup

This project now includes comprehensive test suites for both the backend server and the bot engine package.

## Test Structure

### Backend Tests (`apps/server`)
- **API Router Tests**: Tests for all API endpoints including authentication and authorization
- **Server Integration Tests**: End-to-end tests for HTTP server functionality
- **Context Creation Tests**: Tests for session and authentication context handling

### Bot Engine Tests (`packages/bot-engine`)
- **Engine Tests**: Core flow execution engine functionality
- **Node Tests**: Individual node type implementations (Message, SetVar, etc.)
- **Storage Tests**: Memory storage implementation
- **Utility Tests**: Template and expression evaluation utilities
- **Evaluator Tests**: Node factory and creation logic

## Running Tests

### Run all tests across the monorepo:
```bash
pnpm test
```

### Run tests in watch mode:
```bash
pnpm test:dev
```

### Run tests once (CI mode):
```bash
pnpm test:run
```

### Generate test coverage reports:
```bash
pnpm test:coverage
```

### Run tests for specific packages:
```bash
# Backend only
pnpm --filter server test

# Bot engine only  
pnpm --filter @fyn/flow-engine test
```

## Test Configuration

- **Framework**: Vitest (fast, modern, ESM-compatible)
- **Coverage**: V8 provider with HTML, JSON, and text reports
- **Environment**: Node.js testing environment
- **Mocking**: Built-in Vitest mocking capabilities

## Coverage Reports

After running `pnpm test:coverage`, reports are available at:
- `apps/server/coverage/index.html` - Backend coverage
- `packages/bot-engine/coverage/index.html` - Bot engine coverage

## Writing Tests

### Test Structure
```typescript
import { describe, it, expect } from 'vitest';

describe('Component Name', () => {
  it('should describe what it does', () => {
    // Test implementation
    expect(actual).toBe(expected);
  });
});
```

### Mocking Dependencies
```typescript
import { vi } from 'vitest';

// Mock external modules
vi.mock('@fyn/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));
```

### Async Testing
```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeTruthy();
});
```

## Continuous Integration

Tests run automatically in the Turbo build pipeline. The test tasks include:
- Dependencies on build tasks for proper compilation
- Input tracking for efficient caching
- Output capture for coverage reports

## Best Practices

1. **Test Naming**: Use descriptive test names that explain the behavior being tested
2. **Isolation**: Each test should be independent and not rely on other tests
3. **Mocking**: Mock external dependencies to ensure unit tests are focused
4. **Coverage**: Aim for high test coverage but focus on critical business logic
5. **Performance**: Keep tests fast by avoiding unnecessary async operations

## Troubleshooting

### Common Issues

1. **Module Resolution**: Ensure all imports use correct paths and aliases
2. **Type Errors**: Make sure test files have proper TypeScript configuration
3. **Async Tests**: Use proper async/await patterns for asynchronous operations
4. **Mocking**: Verify mocks are properly configured before test execution

### Debug Mode

Run tests with debug information:
```bash
DEBUG=vitest* pnpm test
```

For verbose output:
```bash
pnpm test --reporter=verbose
```