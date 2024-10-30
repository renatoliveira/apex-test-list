/* eslint-disable no-console */
'use strict';

import { availableParallelism } from 'node:os';
import { readdirSync, readFileSync } from 'node:fs';
import { queue } from 'async';
import { parseTestsNames, parseTestSuiteFile, parseTestSuitesNames } from './parsers.js';
import { SearchResult } from './types.js';

const TEST_NAME_REGEX = /@tests\s*:\s*([^/\n]+)/gi;
const TEST_SUITE_NAME_REGEX = /@testsuites\s*:\s*([^/\n]+)/gi;
const TEST_CLASS_ANNOTATION_REGEX = /@istest\n(private|public|global)/gi;

export function getConcurrencyThreshold(): number {
  const AVAILABLE_PARALLELISM: number = availableParallelism ? availableParallelism() : Infinity;

  return Math.min(AVAILABLE_PARALLELISM, 6);
}

/**
 * Given a certain directory, search its contents for files that end with
 * '.testSuite-meta.xml' and extract the class names mentioned in the test
 * suites.
 *
 * @param directory directory within the project to search for files
 * @returns a Promise<string> with a list of test names
 */
export async function searchDirectoryForTestNamesInTestSuites(
  directory: string,
  packageDirectories: string[],
): Promise<string[]> {
  const testClassesNames: Set<string> = new Set<string>();
  let readDir;

  try {
    readDir = readdirSync(directory, { recursive: true }) as string[];
  } catch (error) {
    throw new Error(`Invalid or inaccessible directory: ${directory}`);
  }

  // Gets the list of test suites
  const suiteFiles = readDir.filter((file) => file.endsWith('.testSuite-meta.xml'));
  const wildcards: Set<string> = new Set<string>();
  let requiresWildcardSearch = false;

  // Function that handles the parsing of test suites and helps to build the
  // list of test classes for the next steps
  const testSuiteNameHandler = (fileName: string): void => {
    const path = `${directory}/${fileName}`;
    const data = readFileSync(path, 'utf-8');
    const classes = parseTestSuiteFile(data);

    // TODO: Support for wildcards
    for (const test of classes) {
      if (test.includes('*')) {
        requiresWildcardSearch = true;
        wildcards.add(test);
        continue;
      }
      testClassesNames.add(test);
    }
  };

  // define the processors
  const testSuiteNameProcessor = queue((f: string, cb: (error?: Error | undefined) => void) => {
    testSuiteNameHandler(f);
    cb();
  }, getConcurrencyThreshold());

  // initialize the processor with the names of files we want to process
  await testSuiteNameProcessor.push(suiteFiles);

  // make sure no dangling process is left before continuing
  if (testSuiteNameProcessor.length() > 0) {
    await testSuiteNameProcessor.drain();
  }

  if (requiresWildcardSearch && packageDirectories) {
    for (const pkgDir of packageDirectories) {
      // eslint-disable-next-line no-await-in-loop
      const searchResult = await searchDirectoryForTestClasses(pkgDir, null);
      const testClassesInDir = searchResult.classes;

      for (const test of testClassesInDir) {
        // if the test class name matches the wildcard, add it to the list
        for (const wildcard of wildcards) {
          if (!matchWildcard(wildcard, test)) {
            continue;
          }

          testClassesNames.add(test);
        }
      }
    }
  }

  return Array.from(testClassesNames).sort();
}

export function matchWildcard(wildcard: string, test: string): boolean {
  const regex = new RegExp(`^${wildcard.replace('*', '.*')}$`);
  return regex.test(test);
}

/**
 * Given a certain directory, search its contents for files that end with '.cls' or '.trigger'.
 * Extracts the test names from the annotations on those files, and returns a list with those.
 *
 * @param directory directory within the project to search for files
 * @param names names of test files
 * @returns list of test classes
 */
export async function searchDirectoryForTestClasses(directory: string, names: string[] | null): Promise<SearchResult> {
  const testClassesNames: Set<string> = new Set<string>();
  const testSuitesNames: Set<string> = new Set<string>();
  let readDir;

  try {
    readDir = readdirSync(directory, { recursive: true }) as string[];
  } catch (error) {
    throw new Error(`Invalid or inaccessible directory: ${directory}`);
  }

  // Gets the list of Apex files (classes and triggers)
  const apexFiles = readDir.filter((file) => {
    if (!file.endsWith('.cls') && !file.endsWith('.trigger')) {
      return false;
    }

    const fileFullName: string[] | undefined = file.split('/').pop()?.split('.');

    if (!names) {
      return true;
    }

    if (fileFullName && fileFullName.length > 0) {
      const formattedName = `${fileFullName[1] === 'cls' ? 'ApexClass' : 'ApexTrigger'}:${fileFullName[0]}`;
      return names.includes(formattedName);
    }
  });

  // Function that handles the parsing of test classes and helps to build the
  // list of test classes
  const testClassNameHandler = (fileName: string): void => {
    const path = `${directory}/${fileName}`;
    const data = readFileSync(path, 'utf-8');
    const matches = data.matchAll(TEST_NAME_REGEX);

    for (const match of matches) {
      if (match && match.length > 0) {
        parseTestsNames(match).forEach((testMethod) => {
          testClassesNames.add(testMethod);
        });
      }
    }

    // check if the class is itself a test class, if it is, add it to the list
    const testClassAnnotationMatches = data.match(TEST_CLASS_ANNOTATION_REGEX);

    if (testClassAnnotationMatches && testClassAnnotationMatches.length > 0) {
      testClassesNames.add(fileName.split('.').shift() as string);
    }
  };

  const testSuiteNameHandler = (fileName: string): void => {
    const path = `${directory}/${fileName}`;
    const data = readFileSync(path, 'utf-8');
    const matches = data.matchAll(TEST_SUITE_NAME_REGEX);

    for (const match of matches) {
      parseTestSuitesNames(match).forEach((testMethod) => {
        testSuitesNames.add(testMethod);
      });
    }
  };

  // initialize the processor with the names of files we want to process
  const testClassNameProcessor = queue((f: string, cb: (error?: Error | undefined) => void) => {
    testClassNameHandler(f);
    testSuiteNameHandler(f);
    cb();
  }, getConcurrencyThreshold());

  // initialize the processor with the names of files we want to process
  await testClassNameProcessor.push(apexFiles);

  // make sure no dangling process is left before continuing
  if (testClassNameProcessor.length() > 0) {
    await testClassNameProcessor.drain();
  }

  // return the list of apex tests, sorted
  return { classes: Array.from(testClassesNames), testSuites: Array.from(testSuitesNames) };
}
