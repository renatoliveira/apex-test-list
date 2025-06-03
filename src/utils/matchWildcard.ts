export function matchWildcard(wildcard: string, test: string): boolean {
  const regex = new RegExp(`^${wildcard.replace('*', '.*')}$`);
  return regex.test(test);
}