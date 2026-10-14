import type { DataErrorCode } from '@/data/types';

export class DataError extends Error {
  constructor(public readonly code: DataErrorCode) {
    super(code);
    this.name = 'DataError';
  }
}
