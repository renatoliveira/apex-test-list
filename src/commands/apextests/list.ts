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
    'ignore-package-directory': Flags.directory({
      summary: messages.getMessage('flags.ignore-package-directory.summary'),
      description: messages.getMessage('flags.ignore-package-directory.description'),
      char: 'd',
      required: false,
      multiple: true,
    }),
    'no-warnings': Flags.boolean({
      summary: messages.getMessage('flags.no-warnings.summary'),
      description: messages.getMessage('flags.no-warnings.description'),
      char: 'n',
      required: false,
      default: false,
    }),
  };

  public async run(): Promise<ApextestsListResult> {
    const { flags } = await this.parse(ApextestsList);

    const format = flags.format ?? 'sf';
    const manifest = flags.manifest ?? undefined;
    const ignoreMissingTests = flags['ignore-missing-tests'] ?? false;
    const ignoreDirs = flags['ignore-package-directory'] ?? [];
    const noWarnings = flags['no-warnings'];

    let testClassesNames: string[] | null = null;
    const testSuitesNames: string[] = [];
    const allTestClasses: string[] = [];
    const warnings: string[] = [];

    // Get package directories full paths
    const packageDirectories = await getPackageDirectories(ignoreDirs);

    if (manifest) {
      const manifestMetadata = await extractTypeNamesFromManifestFile(manifest);
      testClassesNames = manifestMetadata.filter((name) => !name.endsWith('testSuite-meta.xml'));
    }

    // Loop through each directory and search for test classes
    for (const directory of packageDirectories) {
      const searchResult: SearchResult = await searchDirectoryForTestClasses(directory, testClassesNames);
      allTestClasses.push(...searchResult.classes);
      testSuitesNames.push(...searchResult.testSuites);
      if (searchResult.warnings?.length) {
        warnings.push(...searchResult.warnings);
      }
    }

    if (testSuitesNames.length > 0) {
      for (const directory of packageDirectories.filter((dir) => dir.includes('testSuites'))) {
        const testNames: string[] = await searchDirectoryForTestNamesInTestSuites(directory, packageDirectories);
        allTestClasses.push(...testNames);
      }
    }

    let finalTestMethods = Array.from(new Set(allTestClasses.map((test) => test.trim())));

    // If ignore-missing-tests is true, validate the test methods
    if (ignoreMissingTests) {
      const { validatedTests, warnings: validationWarnings } = await validateTests(
        finalTestMethods,
        packageDirectories,
      );
      finalTestMethods = validatedTests;

      if (validationWarnings.length > 0) {
        warnings.push(...validationWarnings);
      }

      if (validatedTests.length === 0) {
        warnings.push('No test methods declared in your annotations were found in your package directories');
      }
    }

    // Print all collected warnings
    if (!noWarnings && warnings.length > 0) {
      warnings.forEach((warning) => {
        this.warn(warning);
      });
    }

    finalTestMethods.sort((a, b) => a.localeCompare(b));

    if (finalTestMethods.length === 0) {
      this.warn('No test methods found');
      return {
        tests: [],
        command: '',
      };
    }

    const result = await formatList(format, finalTestMethods);
    this.log(result.command);
    return result;
  }
}
