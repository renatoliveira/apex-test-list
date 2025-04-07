'use strict';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

export async function validateTests(
  unvalidatedTests: string[],
  packageDirectories: string[],
): Promise<{ validatedTests: string[]; warnings: string[] }> {
  const warnings: string[] = [];
  const validatedTests: string[] = [];

  // Run findFilePath for all tests concurrently
  const results = await Promise.all(
    unvalidatedTests.map(async (unvalidatedTest) => {
      const testPath = await findFilePath(`${unvalidatedTest}.cls`, packageDirectories);
      return { test: unvalidatedTest, testPath };
    })
  );

  for (const { test, testPath } of results) {
    if (testPath === undefined) {
      warnings.push(`The test method ${test}.cls was not found in any package directory`);
    } else {
      validatedTests.push(test);
    }
  }

  return { validatedTests, warnings };
}

export async function findFilePath(fileName: string, packageDirectories: string[]): Promise<string | undefined> {
  // Run searchRecursively for all directories concurrently
  const results = await Promise.all(
    packageDirectories.map((directory) => searchRecursively(fileName, directory))
  );

  return results.find((result) => result !== undefined);
}

async function searchRecursively(fileName: string, dxDirectory: string): Promise<string | undefined> {
  const files = await readdir(dxDirectory);

  // Map over files to handle all asynchronous operations concurrently
  const results = await Promise.all(
    files.map(async (file) => {
      const filePath = join(dxDirectory, file);
      const stats = await stat(filePath);
      if (stats.isDirectory()) {
        return searchRecursively(fileName, filePath);
      } else if (file === fileName) {
        return filePath;
      }
      return undefined;
    })
  );

  return results.find((result) => result !== undefined);
}
