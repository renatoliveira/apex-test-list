'use strict';

import { existsSync } from 'node:fs';
import { ComponentSet } from '@salesforce/source-deploy-retrieve';

/**
 * Given a certain manifest file, reads that file and returns the classes,
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

  const componentSet: ComponentSet = await ComponentSet.fromManifest({ manifestPath: manifestFile });
  for (const component of componentSet) {
    const typeName = component.type.name;
    result.push(`${typeName}:${component.fullName}`);
  }

  return result.sort((a, b) => a.localeCompare(b));
}
