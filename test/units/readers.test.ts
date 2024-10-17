import { expect } from 'chai';
import { searchDirectoryForTestClasses, searchDirectoryForTestNamesInTestSuites } from '../../src/helpers/readers.js';

describe('tests of the searchDirectoryForTestNamesInTestSuites fn', () => {
  it('should read the sample suite from the file', async () => {
    const suitePath = './samples/testSuites';
    const result = await searchDirectoryForTestNamesInTestSuites(suitePath);

    expect(result).to.deep.equal(['UnlistedTest']);
  });
});

describe('tests of the searchDirectoryForTestClasses fn', () => {
  it('should read the sample suite from the file', async () => {
    const classesPath = './samples/classes';
    const result = await searchDirectoryForTestClasses(classesPath, ['ApexClass:Sample']);

    expect(result).to.deep.equal({
      classes: ['SampleTest', 'SuperSampleTest'],
      testSuites: ['SampleSuite'],
    });
  });
});
