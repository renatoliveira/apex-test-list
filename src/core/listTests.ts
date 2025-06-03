/* eslint-disable no-await-in-loop */
import { getPackageDirectories } from '../utils/getPackageDirectories.js';
import { validateTests } from '../utils/validateTests.js';
import { extractTypeNamesFromManifestFile } from '../parsers/manifestParser.js';
import { formatList } from '../utils/formatters.js';
import { searchDirectoryForTestClasses } from '../readers/directorySearcher.js';
import { searchDirectoryForTestNamesInTestSuites } from '../readers/testSuiteSearcher.js';
import { SearchResult, ListTestsOptions, ApextestsListResult } from '../utils/types.js';

export async function listTests({
  format = 'sf',
  manifest,
  ignoreMissingTests = false,
  ignoreDirs = [],
  noWarnings = false,
  warn = (): void => {},
}: ListTestsOptions): Promise<ApextestsListResult> {
  let testClassesNames: string[] | null = null;
  const testSuitesNames: string[] = [];
  const allTestClasses: string[] = [];
  const warnings: string[] = [];

  const packageDirectories = await getPackageDirectories(ignoreDirs);

  if (manifest) {
    const manifestMetadata = await extractTypeNamesFromManifestFile(manifest);
    testClassesNames = manifestMetadata.filter((name) => !name.endsWith('testSuite-meta.xml'));
  }

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
      const testNames = await searchDirectoryForTestNamesInTestSuites(directory, packageDirectories);
      allTestClasses.push(...testNames);
    }
  }

  let finalTestMethods = Array.from(new Set(allTestClasses.map((test) => test.trim())));

  if (ignoreMissingTests) {
    const { validatedTests, warnings: validationWarnings } = await validateTests(
      finalTestMethods,
      packageDirectories,
    );
    finalTestMethods = validatedTests;
    warnings.push(...validationWarnings);
    if (validatedTests.length === 0) {
      warnings.push('No test methods declared in your annotations were found in your package directories');
    }
  }

  if (!noWarnings && warnings.length > 0) {
    warnings.forEach(warn);
  }

  finalTestMethods.sort((a, b) => a.localeCompare(b));

  if (finalTestMethods.length === 0) {
    warn('No test methods found');
    return {
      tests: [],
      command: '',
    };
  }

  return formatList(format, finalTestMethods);
}
