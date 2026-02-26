import { describe, it, expect } from 'vitest';
import { abbreviateAddress, formatStxAmount, formatDateTime } from '../lib/stx-utils';

describe('stx-utils', () => {
  describe('abbreviateAddress', () => {
    it('abbreviates a long Stacks address', () => {
      const address = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      expect(abbreviateAddress(address)).toBe('ST1PQH...GZGM');
    });

    it('returns the same string if it is too short', () => {
      expect(abbreviateAddress('ST1P')).toBe('ST1P');
    });
  });

  describe('formatStxAmount', () => {
    it('formats micro-STX to STX correctly', () => {
      expect(formatStxAmount(1000000)).toBe('1 STX');
      expect(formatStxAmount(1500000)).toBe('1.500000 STX');
      expect(formatStxAmount(500000)).toBe('0.500000 STX');
    });

    it('handles string amounts', () => {
      expect(formatStxAmount('2000000')).toBe('2 STX');
    });
  });

  describe('formatDateTime', () => {
    it('formats a timestamp properly', () => {
      const timestamp = 1672531200000; // Jan 1 2023
      expect(formatDateTime(timestamp)).toContain('2023'); // Assuming localized to 2023 for general US tests
    });
  });
});
