import { rm, writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';

import { SFDX_PROJECT_FILE_NAME } from '../../../src/helpers/constants.js';

const TEST_LIST = ['Sample2Test', 'SampleTest', 'SampleTriggerTest', 'SuperSample2Test', 'SuperSampleTest'].sort(
  (a, b) => a.localeCompare(b)
);

describe('apextests list NUTs', () => {
  let session: TestSession;

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

  before(async () => {
    session = await TestSession.create({ devhubAuthStrategy: 'NONE' });
  });

  after(async () => {
    await session?.clean();
    await rm(SFDX_PROJECT_FILE_NAME);
  });

  it('should display the help information', () => {
    const command = 'apextests list --help';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output.replace('\n', '')).to.include('List');
  });

  it('runs list', async () => {
    const command = 'apextests list --ignore-missing-tests';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;

    expect(output.replace('\n', '')).to.equal(`--tests ${TEST_LIST.join(' ')}`);
  });

  it('runs list with --json', async () => {
    const command = 'apextests list --json --ignore-missing-tests';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(JSON.parse(output).result.command).to.equal(`--tests ${TEST_LIST.join(' ')}`);
  });

  it('runs list --format csv', async () => {
    const command = `apextests list ${['--format', 'csv', '--ignore-missing-tests'].join(' ')} --json`;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(JSON.parse(output).result.command).to.equal(TEST_LIST.join(','));
  });

  it('runs list --format csv --manifest samples/samplePackage.xml', async () => {
    const command = `apextests list --format csv --manifest ${path.join('samples', 'samplePackage.xml')}`;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;

    expect(output.replace('\n', '')).to.equal('SampleTest,SuperSampleTest');
  });

  it('runs list --format csv --manifest samples/samplePackageWithTrigger.xml', async () => {
    const command = `apextests list --format csv --manifest ${path.join('samples', 'samplePackageWithTrigger.xml')}`;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;

    expect(output.replace('\n', '')).to.equal('SampleTest,SampleTriggerTest,SuperSampleTest');
  });
});
