# Apex Test List

[![NPM](https://img.shields.io/npm/v/apextestlist.svg?label=apextestlist)](https://www.npmjs.com/package/apextestlist) [![Downloads/week](https://img.shields.io/npm/dw/apextestlist.svg)](https://npmjs.org/package/apextestlist) [![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/apextestlist/main/LICENSE.txt)

A plugin that generates a list of tests that your, ideally, automated process should run, so you can save time by not running all tests in your Salesforce org and also save time by not specifying them manually.

## Usage

List all files specified in the classes in your package directories and have the result be in the format for the CLI.

The classes should have a comment starting with `@Tests` somewhere. This is what the tool reads to return the tests. For example, the `Sample.cls` file in the `samples` folder contains a comment like this:

```java
// @Tests: SampleTest,SuperSampleTest
public class Sample {
  // ...
}
```

In the context of this plugin, this annotation/comment on the class means that _the tests that should cover this test class are called `SampleTest` and `SuperSampleTest`_.

> Note: By default, this tool with not check if those classes exist within your project. If you want to check that test methods are found in your package directories, provide the optional `--ignore-missing-tests` flag. When the flag is provided, a warning will be printed for each test class it is unable to find in any of your package directories and will not add those missing tests to the final output.

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
