/* eslint-disable no-console */
'use strict';
/* eslint-disable no-await-in-loop */

import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

import { getPackageDirectories } from '../../helpers/getPackageDirectories.js';
import { validateTests } from '../../helpers/validateTests.js';
import { extractTypeNamesFromManifestFile } from '../../helpers/parsers.js';
import { formatList } from '../../helpers/formatters.js';
import { searchDirectoryForTestClasses, searchDirectoryForTestNamesInTestSuites } from '../../helpers/readers.js';
import { SearchResult } from '../../helpers/types.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('apextestlist', 'apextests.list');

export type ApextestsListResult = {
  tests: string[];
  command: string;
  // TODO: in the future, return the test suites as well
};

export default class ApextestsList extends SfCommand<ApextestsListResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    format: Flags.string({
      summary: messages.getMessage('flags.format.summary'),
      description: messages.getMessage('flags.format.description'),
      char: 'f',
      required: false,
    }),
    manifest: Flags.string({
      summary: messages.getMessage('flags.manifest.summary'),
      description: messages.getMessage('flags.manifest.description'),
      char: 'x',
      required: false,
    }),
    'ignore-missing-tests': Flags.boolean({
      summary: messages.getMessage('flags.ignore-missing-tests.summary'),
      description: messages.getMessage('flags.ignore-missing-tests.description'),
      required: false,
      char: 's',
      default: false,
    }),
  };

  public async run(): Promise<ApextestsListResult> {
    const { flags } = await this.parse(ApextestsList);

    const format = flags.format ?? 'sf';
    const manifest = flags.manifest ?? undefined;
    const ignoreMissingTests = flags['ignore-missing-tests'] ?? false;

    let result: Promise<ApextestsListResult> | null = null;
    let testClassesNames: string[] | null = null;
    const testSuitesNames: string[] = [];

    // Get package directories full paths
    const packageDirectories = await getPackageDirectories();

    if (manifest) {
      const manifesMetadata = await extractTypeNamesFromManifestFile(manifest);
      testClassesNames = manifesMetadata.filter((name) => !name.endsWith('testSuite-meta.xml'));
    }

    const allTestClasses: string[] = [];

    // Loop through each directory and search for test classes
    for (const directory of packageDirectories) {
      const searchResult: SearchResult = await searchDirectoryForTestClasses(directory, testClassesNames);
      const testClassesInDir: string[] = searchResult.classes;
      const testSuitesMentioned: string[] = searchResult.testSuites;

      allTestClasses.push(...testClassesInDir);
      testSuitesNames.push(...testSuitesMentioned);
    }

    if (testSuitesNames.length > 0) {
      // read the testSuite directory again to get the classes listed on them
      for (const directory of packageDirectories.filter((dir) => dir.includes('testSuites'))) {
        const testNames: string[] = await searchDirectoryForTestNamesInTestSuites(directory);
        allTestClasses.push(...testNames);
      }
    }

    // Ensure all test methods are unique by using a Set
    let finalTestMethods = Array.from(new Set(allTestClasses.map((test) => test.trim())));

    // If ignore-missing-tests is true, validate the test methods
    if (ignoreMissingTests) {
      const { validatedTests, warnings } = await validateTests(finalTestMethods, packageDirectories);

      if (validatedTests.length > 0) {
        finalTestMethods = validatedTests;
      } else {
        throw new Error('No test methods declared in your annotations were found in your package directories.');
      }

      // Log any warnings
      if (warnings.length > 0) {
        warnings.forEach((warning) => {
          this.warn(warning);
        });
      }
    }
    finalTestMethods.sort((a, b) => a.localeCompare(b));

    if (finalTestMethods.length > 0) {
      result = formatList(format, finalTestMethods);
    } else {
      throw new Error('No test methods found');
    }

    this.log((await result).command);
    return result;
  }
}
