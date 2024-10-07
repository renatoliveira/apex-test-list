import { readFileSync } from 'node:fs';
import { expect } from 'chai';
import { parseTestSuiteFile } from '../../src/helpers/parsers.js';

describe('should parse xml suite', () => {
  it('should read the sample suite', async () => {
    const suitePath = './samples/testSuites/SampleSuite.testSuite-meta.xml';
    const result = parseTestSuiteFile(readFileSync(suitePath, 'utf-8'));

    expect(result).to.deep.equal(['Sample*Test', 'UnlistedTest']);
  });
});
