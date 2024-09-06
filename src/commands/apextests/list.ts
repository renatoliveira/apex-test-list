import * as fs from 'node:fs';
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('apextestlist', 'apextests.list');

export type ApextestsListResult = {
  files: string[];
};

export default class ApextestsList extends SfCommand<ApextestsListResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    directory: Flags.string({
      summary: messages.getMessage('flags.directory.summary'),
      description: messages.getMessage('flags.directory.description'),
      char: 'd',
      required: false,
    }),
    manifest: Flags.string({
      summary: messages.getMessage('flags.manifest.summary'),
      description: messages.getMessage('flags.manifest.description'),
      char: 'x',
      required: false,
    }),
  };

  private static parseTestsNames(data: string): string[] {
    // remove the prefix @Tests or @TestSuites
    return data
      .split(',')
      .map((line) => line.replace(/(@Tests|@TestSuites)/, ''))
      .map((line) => line.replace(':', ''))
      .filter((line) => line.trim().length > 0);
  }

  public async run(): Promise<ApextestsListResult> {
    const { flags } = await this.parse(ApextestsList);

    const directory = flags.directory ?? '.';
    const manifest = flags.manifest;

    if (directory && manifest) {
      // throw an error because both flags can't be used together
      throw new Error('Both directory and manifest flags cannot be used together');
    }

    if (directory) {
      return this.listTestsInDirectory(directory);
    }

    throw new Error('No directory or manifest provided');
  }

  private listTestsInDirectory(directory: string): Promise<ApextestsListResult> {
    // check if the provided directory exists
    if (directory) {
      const readDir = fs.readdirSync(directory, { recursive: true }) as string[];
      const files = readDir.filter((file) => file.endsWith('.cls'));

      // read each file and check for the test methods at the top
      files.map((file) => {
        const data = fs.readFileSync(`${directory}/${file}`, 'utf8');

        // try to find, with a RegEx, the test methods listed at the top of the
        // file with @Tests or @TestSuites
        const testMethods = data.match(/(@(Tests|TestSuites)).+/g);
        // for each entry, parse the names
        const testMethodsNames = testMethods ? ApextestsList.parseTestsNames(testMethods.join(',')) : [];
        this.log(testMethodsNames.join(','));
      });
    }

    return Promise.resolve({
      files: [],
    });
  }
}
