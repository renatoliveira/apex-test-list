'use strict';

export type SfdxProject = {
  packageDirectories: Array<{ path: string }>;
};

export type SearchResult = {
  classes: string[];
  testSuites: string[];
  warnings: string[];
};

export type ApextestsListResult = {
  tests: string[];
  command: string;
};

export type ListTestsOptions = {
  format?: string;
  manifest?: string;
  ignoreMissingTests?: boolean;
  ignoreDirs?: string[];
  noWarnings?: boolean;
  warn?: (msg: string) => void;
};
