# Apex Test List

[![NPM](https://img.shields.io/npm/v/apextestlist.svg?label=apextestlist)](https://www.npmjs.com/package/apextestlist) [![Downloads/week](https://img.shields.io/npm/dw/apextestlist.svg)](https://npmjs.org/package/apextestlist) [![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/apextestlist/main/LICENSE.txt)

A plugin that generates a list of tests that your, ideally, automated process should run, so you can save time by not running all tests in your Salesforce org and also save time by not specifying them manually.

This plugin is intended to be ran in any version control repository that follows the Salesforce DX project structure (`sfdx-project.json` file).

## Install

Simply issue a install command with `sf`, as in:

```bash
sf plugins install apextestlist
```

## Usage

List all files specified in the classes in your package directories and have the result be in the format for the CLI.

The classes should have a comment starting with the `@Tests:` prefix somewhere. This is what the tool reads to return the tests. You can separate multiple tests by commas, spaces, or both. This tool will parse both and remove extra spaces it may find.

For example, the `Sample.cls` file in the `samples` folder contains a comment like this:

```java
// @Tests: SampleTest,SuperSampleTest
public class Sample {
  // ...
}
```

Optionally, you may add also test suites with the `@TestSuites:` prefix to the annotation. Like with tests, multiple test suites can be separated by any combination of commas or spaces.

```java
// @TestSuites: SampleSuite SampleSuite2
public class Sample {
  // ...
}
```

And you can add a mix of both too, if needed. Both test annotation prefixes are case-insensitive, but the tests themselves should match the cases as they appear in Salesforce.

In the context of this plugin, this annotation/comment on the class means that _the tests that should cover this test class are called `SampleTest` and `SuperSampleTest`_.

> Note: By default, this tool does not check if those classes exist within your project, so make sure to keep the annotations up-to-date. If you want to check that test annotations are found in your package directories, provide the optional `--ignore-missing-tests` Boolean flag. When the flag is provided, a warning will be printed for each test annotation it is unable to find in any of your package directories and will not add those missing annotations to the final output.

Then, assuming you want to run only the tests provided at the top level of your classes, use the command as follows:

```sh
sf apextests list --format sf
$ --tests SampleTest SuperSampleTest Sample2Test SuperSample2Test
```

This commnad is originally designed to be used in the context of a CI/CD pipeline. So that when your pipeline has a commnad to validate or deploy code to a Salesforce org, it will dynamically build the list of classes, like so:

```sh
sf project deploy start $(sf apextests list)
```

This then becomes the full command to deploy and run only the tests that you - in theory - deem to be necessary:

```sh
sf project deploy start --tests SampleTest SuperSampleTest Sample2Test SuperSample2Test SampleTriggerTest
```

```
USAGE
  $ sf apextests list -f <value> -x <value> -s -d <value> [--json]

FLAGS
  -f, --format=<value>            By default, the format being returned is a list in the format that can be merged with the test flags of the Salesforce CLI deploy and validate commands.
                                  Available formats are `sf` (default) and `csv`.
  -x, --manifest=<value>          Manifest XML file (package.xml).
  -s, --ignore-missing-tests      [default: false] If this Boolean flag is provided, ignore test methods that are not found in any of your local package directories.
  -d, --ignore-package-directory  Ignore a package directory when looking for test annotations.
                                  Should match how they are declared in the "sfdx-project.json".
                                  Can be declared multiple times.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Lists tests in a package.xml file or from your package directories.

EXAMPLES
  List all test annotations found in all of your package directories in the Salesforce CLI format:

    $ sf apextests list --format sf

  List all test annotations found in all of your package directories in CSV format:

    $ sf apextests list --format csv

  List test annotations found only in the Apex classes/triggers listed in a manifest file:

    $ sf apextests list --format sf --manifest package.xml

  List test annotations only if they have been found in any of your local package directories:

    $ sf apextests list --format sf --ignore-missing-tests

  List all test annotations except for those found in the "force-app" directory.

    $ sf apextests list -d "force-app"

```
