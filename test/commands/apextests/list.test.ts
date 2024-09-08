import { TestContext } from '@salesforce/core/testSetup';
import { expect } from 'chai';
import { stubSfCommandUx } from '@salesforce/sf-plugins-core';
import ApextestsList from '../../../src/commands/apextests/list.js';

const TEST_LIST = ['Sample2Test', 'SampleTest', 'SampleTriggerTest', 'SuperSample2Test', 'SuperSampleTest'].sort();

describe('apextests list', () => {
  const $$ = new TestContext();
  let sfCommandStubs: ReturnType<typeof stubSfCommandUx>;

  beforeEach(() => {
    sfCommandStubs = stubSfCommandUx($$.SANDBOX);
  });

  afterEach(() => {
    $$.restore();
  });

  it('runs list', async () => {
    await ApextestsList.run([]);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(output).to.equal(`--tests ${TEST_LIST.join(' ')}`);
  });

  it('runs list with --json', async () => {
    const result = await ApextestsList.run([]);
    expect(result.command).to.equal(`--tests ${TEST_LIST.join(' ')}`);
  });

  it('runs list --format csv --directory samples', async () => {
    await ApextestsList.run(['--format', 'csv', '--directory', 'samples']);
    const output = sfCommandStubs.log
      .getCalls()
      .flatMap((c) => c.args)
      .join('\n');
    expect(output).to.equal(TEST_LIST.join(','));
  });
});
