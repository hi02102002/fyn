import { describe, it, expect, vi } from 'vitest';
import { createContext } from '@fyn/api/context';

// Mock the auth module
vi.mock('@fyn/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe('Context Creation', () => {
  it('should create context with null session when not authenticated', async () => {
    const mockHonoContext = {
      req: {
        raw: {
          headers: new Headers(),
        },
      },
    };

    // Mock auth.api.getSession to return null
    const { auth } = await import('@fyn/auth');
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const context = await createContext({ context: mockHonoContext as any });

    expect(context).toEqual({
      session: null,
    });
  });

  it('should create context with session when authenticated', async () => {
    const mockSession = {
      user: {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      },
      session: {
        id: 'session123',
        userId: 'user123',
        expiresAt: new Date(),
      },
    };

    const mockHonoContext = {
      req: {
        raw: {
          headers: new Headers({
            'authorization': 'Bearer token123',
          }),
        },
      },
    };

    // Mock auth.api.getSession to return session
    const { auth } = await import('@fyn/auth');
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

    const context = await createContext({ context: mockHonoContext as any });

    expect(context).toEqual({
      session: mockSession,
    });
  });
});