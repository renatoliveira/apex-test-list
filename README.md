# Apex Test List

[![NPM](https://img.shields.io/npm/v/apextestlist.svg?label=apextestlist)](https://www.npmjs.com/package/apextestlist) [![Downloads/week](https://img.shields.io/npm/dw/apextestlist.svg)](https://npmjs.org/package/apextestlist) [![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/apextestlist/main/LICENSE.txt)

A plugin that generates a list of tests that your, ideally, automated process should run, so you can save time by not running all tests in your Salesforce org and also save time by not specifying them manually.

## Usage

List all files specified in the classes of a certain directory (and subfolders) and have the result be in the format for the CLI.

```sh
sf apextests list --directory samples --format sf
$ --tests SampleTest SuperSampleTest Sample2Test SuperSample2Test
```
