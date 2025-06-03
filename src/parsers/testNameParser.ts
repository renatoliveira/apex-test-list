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
    .join(' ')
    .replace(/(@tests\s*:\s*)/gi, '')
    .replace(/[,\s]+/g, ' ')
    .trim()
    .split(' ');
}
