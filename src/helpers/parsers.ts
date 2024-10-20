'use strict';

import { existsSync, readFileSync } from 'node:fs';
import { Parser } from 'xml2js';

/**
 * Given a certai nmanifest file, reads that file and returns the classes,
 * triggers and test suites members with their types as prefix.
 *
 * For example, as ApexClass:MyClass.
 *
 * @param manifestFile the path to the manifest file
 * @returns a list of strings with the type and member names
 */
export async function extractTypeNamesFromManifestFile(manifestFile: string): Promise<string[]> {
  const result: string[] = [];

  if (!manifestFile || !existsSync(manifestFile)) {
    return result;
  }

  await new Parser()
    .parseStringPromise(readFileSync(manifestFile, 'utf-8'))
    .then((parsed: { Package: { types: Array<{ name: string; members: string[] }> } }) => {
      parsed.Package.types.forEach((type: { name: string; members: string[] }) => {
        if (
          type.name.includes('ApexClass') ||
          type.name.includes('ApexTrigger') ||
          type.name.includes('ApexTestSuite')
        ) {
          type.members.forEach((member) => {
            result.push(`${type.name}:${member}`);
          });
        }
      });
    })
    .catch((error) => {
      throw error;
    });

  return result.sort((a, b) => a.localeCompare(b));
}

/**
 * Analyzes the content of a test suite xml file and returns the Apex classes
 * included in it.
 *
 * @param data string with the content of the test suite xml file
 * @returns a list of test classes names in the test suite
 */
export function parseTestSuiteFile(data: string): string[] {
  const result: string[] = [];

  new Parser().parseString(data, (error, parsed: { ApexTestSuite: { testClassName: string[] } }) => {
    if (error) {
      throw error;
    }
    parsed.ApexTestSuite.testClassName.forEach((testSuite) => {
      result.push(testSuite);
    });
  });

  return result.sort();
}

/**
 * Parses the line in an Apex file that contains the test names.
 *
 * @param testNames names of the tests in an Apex file line
 * @returns list of the test classes
 */
export function parseTestsNames(testNames: string[] | null): string[] {
  if (!testNames || testNames.length === 0) {
    return [];
  }

  // remove the prefix @Tests
  return testNames
    .join(',')
    .split(',')
    .map((line) => line.replace(/(@tests):/i, ''))
    .map((line) => line.trim())
    .filter((line) => line);
}

/**
 * Parses the line in an Apex file that contains the test suites names.
 *
 * @param testNames names of the test suites in an Apex file line
 * @returns list of the test suites
 */
export function parseTestSuitesNames(testSuitesNames: string[] | null): string[] {
  if (!testSuitesNames || testSuitesNames.length === 0) {
    return [];
  }

  // remove the prefix @testsuites
  return testSuitesNames
    .join(',')
    .split(',')
    .map((line) => line.replace(/(@testsuites):/i, ''))
    .map((line) => line.trim())
    .filter((line) => line);
}
