import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock per fetch globale
global.fetch = vi.fn();

// Mock per IntersectionObserver se necessario
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})); 