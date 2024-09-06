import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('apextestlist', 'apextests.list');

export type ApextestsListResult = {
  path: string;
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
  };

  public async run(): Promise<ApextestsListResult> {
    const { flags } = await this.parse(ApextestsList);

    const directory = flags.directory ?? 'world';
    this.log(`Hello ${directory} from src/commands/apextests/list.ts`);
    return {
      path: 'src/commands/apextests/list.ts',
    };
  }
}
