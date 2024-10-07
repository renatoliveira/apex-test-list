import { expect } from 'chai';
import { searchDirectoryForTestNamesInTestSuites } from '../../src/helpers/readers.js';

describe('should search the directory for the test names', () => {
  it('should read the sample suite from the file', async () => {
    const suitePath = './samples/testSuites';
    const result = await searchDirectoryForTestNamesInTestSuites(suitePath);

    expect(result).to.deep.equal(['UnlistedTest']);
  });
});
