'use strict';
export const SFDX_PROJECT_FILE_NAME = 'sfdx-project.json';
export const SEARCHABLE_METADATA_FOLDERS = ['classes', 'triggers', 'testSuites'];
export const TEST_NAME_REGEX = /@tests\s*:\s*([^/\n]+)/gi;
export const TEST_SUITE_NAME_REGEX = /@testsuites\s*:\s*([^/\n]+)/gi;
export const TEST_CLASS_ANNOTATION_REGEX = /@istest/gi;
