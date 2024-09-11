'use strict';
/* eslint-disable no-await-in-loop */

import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

export async function validateTests(
  unvalidatedTests: string[],
  packageDirectories: string[]
): Promise<{ validatedTests: string[]; warnings: string[] }> {
  const warnings: string[] = [];
  const validatedTests: string[] = [];

  for (const unvalidatedTest of unvalidatedTests) {
    // Pass the test method with the ".cls" extension
    const testPath = await findFilePath(`${unvalidatedTest}.cls`, packageDirectories);
    if (testPath === undefined) {
      warnings.push(`The test method ${unvalidatedTest}.cls was not found in any package directory.`);
    } else {
      validatedTests.push(unvalidatedTest);
    }
  }
  return { validatedTests, warnings };
}

export async function findFilePath(
  fileName: string,
  packageDirectories: string[]
): Promise<string | undefined> {
  let relativeFilePath: string | undefined;
  for (const directory of packageDirectories) {
    relativeFilePath = await searchRecursively(fileName, directory);
    if (relativeFilePath !== undefined) {
      break;
    }
  }
  return relativeFilePath;
}

async function searchRecursively(fileName: string, dxDirectory: string): Promise<string | undefined> {
  const files = await readdir(dxDirectory);
  for (const file of files) {
    const filePath = join(dxDirectory, file);
    const stats = await stat(filePath);
    if (stats.isDirectory()) {
      // Recursively search inside subdirectories
      const result = await searchRecursively(fileName, filePath);
      if (result) {
        return result;
      }
    } else if (file === fileName) {
      return filePath;
    }
  }
  return undefined;
}
