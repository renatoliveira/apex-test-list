import { readFileSync } from 'node:fs';
import { expect } from 'chai';
import { extractTypeNamesFromManifestFile, parseTestsNames, parseTestSuiteFile, parseTestSuitesNames } from '../../src/helpers/parsers.js';

describe('tests of the extractTypeNamesFromManifestFile fn', () => {
  it('should read an empty manifest', async () => {
    const manifestPath = './samples/samplePackageNoTypes.xml';
    const result = await extractTypeNamesFromManifestFile(manifestPath);

    expect(result).to.deep.equal([]);
  });
  it('should read a non-existent manifest', async () => {
    const manifestPath = './samples/invalid.xml';
    const result = await extractTypeNamesFromManifestFile(manifestPath);

    expect(result).to.deep.equal([]);
  });
});

describe('tests of the parseTestSuiteFile fn', () => {
  it('should read the sample suite', async () => {
    const suitePath = './samples/testSuites/SampleSuite.testSuite-meta.xml';
    const result = parseTestSuiteFile(readFileSync(suitePath, 'utf-8'));

    expect(result).to.deep.equal(['Sample*Test', 'UnlistedTest']);
  });
});

describe('tests of the parseTestsNames fn', () => {
  it('should parse tests names', () => {
    const result: string[] = parseTestsNames(['@Tests:SampleTest,AnotherTest', '@Tests:UnlistedTest']);

    expect(result).to.deep.equal(['SampleTest', 'AnotherTest', 'UnlistedTest']);
  });
});

describe('tests of the parseTestSuitesNames fn', () => {
  it('should parse test suites names', () => {
    const result: string[] = parseTestSuitesNames([
      '@TESTSUITES:SampleSuite,AnotherSuite',
      '@testsuites:UnlistedSuite',
    ]);

    expect(result).to.deep.equal(['SampleSuite', 'AnotherSuite', 'UnlistedSuite']);
  });
});
