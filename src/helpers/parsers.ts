'use strict';

import { existsSync, readFileSync } from 'node:fs';
import { Parser } from 'xml2js';

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

export function parseTestsNames(testNames: string[] | null): string[] {
  if (!testNames || testNames.length === 0) {
    return [];
  }

  // remove the prefix @Tests or @TestSuites
  return testNames
    .join(',')
    .split(',')
    .map((line) => line.replace(/(@Tests):/, ''))
    .map((line) => line.trim())
    .filter((line) => line);
}

export function parseTestSuitesNames(testSuitesNames: string[] | null): string[] {
  if (!testSuitesNames || testSuitesNames.length === 0) {
    return [];
  }

  // return [];
  return testSuitesNames
    .join(',')
    .split(',')
    .map((line) => line.replace(/(@TestSuites):/, ''))
    .map((line) => line.trim())
    .filter((line) => line);
}
