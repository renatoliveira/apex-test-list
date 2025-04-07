'use strict';

export type SfdxProject = {
  packageDirectories: Array<{ path: string }>;
};

export type SearchResult = {
  classes: string[];
  testSuites: string[];
  warnings: string[];
};
