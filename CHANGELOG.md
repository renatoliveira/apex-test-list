<!-- markdownlint-disable MD024 MD025 -->
<!-- markdown-link-check-disable -->

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.6.1](https://github.com/renatoliveira/apex-test-list/compare/v1.6.0...v1.6.1) (2024-10-20)


### Bug Fixes

* ignore cases on test name regex ([2363699](https://github.com/renatoliveira/apex-test-list/commit/2363699a259f384bf6658c44773ab7a14fc588be))

## [1.6.0](https://github.com/renatoliveira/apex-test-list/compare/v1.5.1...v1.6.0) (2024-10-20)


### Features

* adds detection of test classes by checking for the "is test" annotation ([3a86d02](https://github.com/renatoliveira/apex-test-list/commit/3a86d02380f8d263ed0983449000a93b28b4ed16))

## [1.5.1](https://github.com/renatoliveira/apex-test-list/compare/v1.4.2...v1.5.1) (2024-10-19)

### Bug Fixes

- fixes the case sensitivity issue that was accidentaly added in 1.5.0 ([e6b2de5](https://github.com/renatoliveira/apex-test-list/commit/e6b2de5eff226a4a7695281aad85a44f3fa77fde))

## [1.4.2](https://github.com/renatoliveira/apex-test-list/compare/v1.4.1...v1.4.2) (2024-10-15)

### Bug Fixes

- ignores case sensitivity on the line cleanup too ([c41056f](https://github.com/renatoliveira/apex-test-list/commit/c41056faedd6476f2bc223a1ea4f05a5a05ae35e))
- ignores case sensitivity when reading tests and test suites names on files ([c737d0e](https://github.com/renatoliveira/apex-test-list/commit/c737d0e62eec36d95a1bcd0e69f83e7cf42b694e))

## [1.4.1](https://github.com/renatoliveira/apex-test-list/compare/v1.4.0...v1.4.1) (2024-10-07)

### Bug Fixes

- **deps:** bump @oclif/core from 4.0.22 to 4.0.27 ([a3e7502](https://github.com/renatoliveira/apex-test-list/commit/a3e750201e23cdf1bf8a17652cd1d2854cc38007))
- **deps:** bump @salesforce/core from 8.5.7 to 8.6.1 ([efac530](https://github.com/renatoliveira/apex-test-list/commit/efac530945c589605a70363a777ba0c7b5aabed5))

## [1.4.0](https://github.com/renatoliveira/apex-test-list/compare/v1.1.0...v1.4.0) (2024-09-20)

### Features

- read sfdx-project.json for package directories ([fc58565](https://github.com/renatoliveira/apex-test-list/commit/fc58565a7e7d036393bb667de4447daca6f976f3))

### Bug Fixes

- convert to set to remove duplicate test methods ([3385541](https://github.com/renatoliveira/apex-test-list/commit/3385541b86d9570a89bb4a33a771baecc824c826))
- reverts Yarn version in packageManager to 1.22.22 ([7ec0c02](https://github.com/renatoliveira/apex-test-list/commit/7ec0c02b52ae7b9f98052cd1dc7c81573f449dbb))
