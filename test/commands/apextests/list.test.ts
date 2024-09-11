import { rm, writeFile } from 'node:fs/promises'
import { TestContext } from '@salesforce/core/testSetup';
import { expect } from 'chai';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import ApextestsList from '../../../src/commands/apextests/list.js';

import { SFDX_PROJECT_FILE_NAME } from '../../../src/helpers/constants.js';

const TEST_LIST = ['Sample2Test', 'SampleTest', 'SampleTriggerTest', 'SuperSample2Test', 'SuperSampleTest'].sort((a, b) => a.localeCompare(b));

describe('apextests list', () => {
  const $$ = new TestContext();
  let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;
  const configFile = {
    packageDirectories: [{ path: 'samples', default: true }],
    namespace: '',
    sfdcLoginUrl: 'https://login.salesforce.com',
    sourceApiVersion: '58.0',
  };
  const configJsonString = JSON.stringify(configFile, null, 2);

  before(async () => {
    await writeFile(SFDX_PROJECT_FILE_NAME, configJsonString);
  });

  beforeEach(() => {
    sfCommandStubs = stubSfCommandUx($$.SANDBOX);
  });

  afterEach(() => {
    $$.restore();
  });


  after(async () => {
    await rm(SFDX_PROJECT_FILE_NAME);
  });

  it('runs list', async () => {
    await ApextestsList.run([]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join(' ');
    expect(output).to.equal(`--tests ${TEST_LIST.join(' ')}`);
    const warnings = sfCommandStubs.warn
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(warnings).to.include('The test method NotYourLuckyDayTest.cls was not found in any package directory.');
  });

  it('runs list with --json', async () => {
    const result = await ApextestsList.run([]);
    expect(result.command).to.equal(`--tests ${TEST_LIST.join(' ')}`);
  });

  it('runs list --format csv', async () => {
    await ApextestsList.run(['--format', 'csv']);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join(' ');
    expect(output).to.equal(TEST_LIST.join(','));
    const warnings = sfCommandStubs.warn
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(warnings).to.include('The test method NotYourLuckyDayTest.cls was not found in any package directory.');
  });

  it('runs list --format csv --manifest samples/samplePackage.xml', async () => {
    await ApextestsList.run(['--format', 'csv', '--manifest', 'samples/samplePackage.xml']);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join(' ');
    expect(output).to.equal('SampleTest,SuperSampleTest');
    const warnings = sfCommandStubs.warn
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(warnings).to.include('');
  });

  it('runs list --format csv --manifest samples/samplePackageWithTrigger.xml', async () => {
    await ApextestsList.run([
      '--format',
      'csv',
      '--manifest',
      'samples/samplePackageWithTrigger.xml',
    ]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join(' ');
    expect(output).to.equal('SampleTest,SampleTriggerTest,SuperSampleTest');
    const warnings = sfCommandStubs.warn
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(warnings).to.include('');
  });
});
