import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from 'chai';

const TEST_LIST = ['Sample2Test', 'SampleTest', 'SampleTriggerTest', 'SuperSample2Test', 'SuperSampleTest'].sort();

describe('apextests list NUTs', () => {
  let session: TestSession;

  before(async () => {
    session = await TestSession.create({ devhubAuthStrategy: 'NONE' });
  });

  after(async () => {
    await session?.clean();
  });

  it('should display the help information', () => {
    const command = 'apextests list --help';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;
    expect(output).to.include('List');
  });

  it('runs list', async () => {
    const command = 'apextests list';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;

    expect(output).to.equal(`--tests ${TEST_LIST.join(' ')}\n`);
  });

  it('runs list with --json', async () => {
    const command = 'apextests list --json';
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(JSON.parse(output).result.command).to.equal(`--tests ${TEST_LIST.join(' ')}`);
  });

  it('runs list --format csv --directory samples', async () => {
    const command = `apextests list ${['--format', 'csv', '--directory', 'samples'].join(' ')} --json`;
    const output = execCmd(command, { ensureExitCode: 0 }).shellOutput.stdout;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(JSON.parse(output).result.command).to.equal(TEST_LIST.join(','));
  });
});
