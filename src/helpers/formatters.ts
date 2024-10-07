'use strict';
import { ApextestsListResult } from '../commands/apextests/list.js';

export async function formatList(format: string, tests: string[]): Promise<ApextestsListResult> {
  switch (format) {
    case 'sf':
      return Promise.resolve({
        tests,
        command: '--tests ' + tests.join(' '),
      });
    case 'csv':
      return Promise.resolve({
        tests,
        command: tests.join(','),
      });
    default:
      throw new Error('Invalid format.');
  }
}
