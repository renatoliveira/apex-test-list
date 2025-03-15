# Apex Test List

[![NPM](https://img.shields.io/npm/v/apextestlist.svg?label=apextestlist)](https://www.npmjs.com/package/apextestlist) [![Downloads/week](https://img.shields.io/npm/dw/apextestlist.svg)](https://npmjs.org/package/apextestlist) [![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/apextestlist/main/LICENSE.txt)

A plugin that generates a list of tests that your automated process should run, so you can save time by not running all tests in your Salesforce org and avoid specifying them manually.

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>

- [Install](#install)
- [Usage](#usage)
  - [1. `@Tests:` (Custom Comment Annotation)](#1-tests-custom-comment-annotation)
  - [2. `@TestSuites:` (Custom Comment Annotation)](#2-testsuites-custom-comment-annotation)
  - [3. `@isTest` (Apex Annotation)](#3-istest-apex-annotation)
- [Running the Tool](#running-the-tool)
  - [Handling Missing Tests](#handling-missing-tests)
- [Command Reference](#command-reference)
- [Issues](#issues)
- [License](#license)
</details>

## Install

Simply install the plugin using `sf`:

```sh
sf plugins install apextestlist
```

## Usage

This tool identifies Apex tests using three annotations:

### 1. `@Tests:` (Custom Comment Annotation)

Classes can specify which tests should be run using a comment with the `@Tests:` prefix. Multiple tests can be separated by commas, spaces, or both.

```java
// @Tests: SampleTest, SuperSampleTest
public class Sample {
  // ...
}
```

This means that `SampleTest` and `SuperSampleTest` should be executed when `Sample.cls` is modified.

### 2. `@TestSuites:` (Custom Comment Annotation)

Test suites can be specified using the `@TestSuites:` prefix. Multiple suites can be separated by commas or spaces.

```java
// @TestSuites: SampleSuite SampleSuite2
public class Sample {
  // ...
}
```

This tells the tool to include all tests contained in `SampleSuite` and `SampleSuite2`.

### 3. `@isTest` (Apex Annotation)

The tool also detects all Apex classes marked with the [`@isTest`](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_classes_annotation_isTest.htm) annotation. Any class or method marked with this annotation is assumed to be a test.

```java
@isTest
private class SampleTest {
  // This test will be included automatically
}
```

## Running the Tool

To generate a test list, run the command in any Salesforce DX project:

```sh
sf apextests list --format sf
```

Example output:

```sh
--tests SampleTest SuperSampleTest Sample2Test SuperSample2Test
```

This command is useful in CI/CD pipelines, dynamically generating the test list for deployments:

```sh
sf project deploy start $(sf apextests list)
```

The final deployment command would look like:

```sh
sf project deploy start --tests SampleTest SuperSampleTest Sample2Test SuperSample2Test SampleTriggerTest
```

### Handling Missing Tests

By default, this tool does **not** verify if the tests specified in `@Tests:` or `@TestSuites:` exist in the project. To enable warnings for missing tests, use:

```sh
sf apextests list --ignore-missing-tests
```

This will print warnings for missing tests and exclude them from the output.

## Command Reference

```
USAGE
  $ sf apextests list -f <value> -x <value> -s -d <value> [--json]

FLAGS
  -f, --format=<value>            Output format. Available options:
                                    - `sf` (default): CLI-friendly test list
                                    - `csv`: Comma-separated values
  -x, --manifest=<value>          Manifest XML file (package.xml) to filter test annotations.
  -s, --ignore-missing-tests      [default: false] Ignore test methods that are not found in any local package directories.
  -d, --ignore-package-directory  Ignore a package directory when looking for test annotations.
                                  Should match how they are declared in "sfdx-project.json".
                                  Can be declared multiple times.

GLOBAL FLAGS
  --json  Format output as JSON.

EXAMPLES
  List all test annotations found in package directories in Salesforce CLI format:

    $ sf apextests list --format sf

  List all test annotations in CSV format:

    $ sf apextests list --format csv

  List test annotations only for Apex classes/triggers in a manifest file:

    $ sf apextests list --format sf --manifest package.xml

  List test annotations only if they exist in the package directories:

    $ sf apextests list --format sf --ignore-missing-tests

  Exclude annotations found in the "force-app" directory:

    $ sf apextests list -d "force-app"
```

## Issues

If you encounter any issues or would like to suggest features, please create an [issue](https://github.com/renatoliveira/apex-test-list/issues).

## License

This project is licensed under the BSD-3 license. Please see the [LICENSE](https://github.com/renatoliveira/apex-test-list/blob/master/LICENSE) file for details.
