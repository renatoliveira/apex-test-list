<!-- markdownlint-disable MD024 MD025 -->
<!-- markdown-link-check-disable -->

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.9.3](https://github.com/renatoliveira/apex-test-list/compare/v1.9.2...v1.9.3) (2024-12-18)


### Bug Fixes

* **deps:** bump @oclif/core from 4.0.32 to 4.0.37 ([1699bf6](https://github.com/renatoliveira/apex-test-list/commit/1699bf60baf36daaf65ec56910811620d693800b))
* ignore cases on type names in manifest files ([be2906d](https://github.com/renatoliveira/apex-test-list/commit/be2906de8dc3d347ee144b87a70d43d3333dc549))

## [1.9.2](https://github.com/renatoliveira/apex-test-list/compare/v1.9.1...v1.9.2) (2024-11-17)


### Bug Fixes

* **deps:** bump @oclif/core from 4.0.31 to 4.0.32 ([4512f80](https://github.com/renatoliveira/apex-test-list/commit/4512f80b67a4f7cead2ef7f8775222e3a1dab3b9))
* **deps:** bump @salesforce/core from 8.6.4 to 8.8.0 ([f81fb1e](https://github.com/renatoliveira/apex-test-list/commit/f81fb1ee4da2bd3d4b77f826200de99964538d74))

## [1.9.1](https://github.com/renatoliveira/apex-test-list/compare/v1.9.0...v1.9.1) (2024-11-09)


### Bug Fixes

* **deps:** bump @oclif/core from 4.0.30 to 4.0.31 ([a12c48e](https://github.com/renatoliveira/apex-test-list/commit/a12c48ecc63f21203ad727bbb74701127f266f68))

## [1.9.0](https://github.com/renatoliveira/apex-test-list/compare/v1.8.0...v1.9.0) (2024-10-30)


### Features

* adds support for tests in namespaces within test suites ([49ca3d6](https://github.com/renatoliveira/apex-test-list/commit/49ca3d66e1ab38dbf0123b7e3215f1dd4df556ef))
* adds wildcard support for tests in test suites ([4463655](https://github.com/renatoliveira/apex-test-list/commit/4463655950bb3273f75ec0aabb7e481f172dba6f))

## [1.8.0](https://github.com/renatoliveira/apex-test-list/compare/v1.7.0...v1.8.0) (2024-10-28)


### Features

* remove dependency on git repos ([8e073bf](https://github.com/renatoliveira/apex-test-list/commit/8e073bfa742b2b863de064c51591b26d8d9de6d5))

## [1.7.0](https://github.com/renatoliveira/apex-test-list/compare/v1.6.5...v1.7.0) (2024-10-26)


### Features

* allow multiple annotation matches in a single file ([c32300a](https://github.com/renatoliveira/apex-test-list/commit/c32300a756731bf54afab0282a4fe011e658376c))

## [1.6.5](https://github.com/renatoliveira/apex-test-list/compare/v1.6.4...v1.6.5) (2024-10-26)


### Bug Fixes

* **deps:** bump @oclif/core from 4.0.27 to 4.0.30 ([343f381](https://github.com/renatoliveira/apex-test-list/commit/343f381c908fa9ba89eca70f0add8844c8fdd98f))
* **deps:** bump @salesforce/sf-plugins-core from 11.3.10 to 11.3.12 ([33687cc](https://github.com/renatoliveira/apex-test-list/commit/33687cc48201312e0154f88beee6a515f196c647))

## [1.6.4](https://github.com/renatoliveira/apex-test-list/compare/v1.6.3...v1.6.4) (2024-10-25)


### Bug Fixes

* stop the regex match at the end of the line ([914cfc7](https://github.com/renatoliveira/apex-test-list/commit/914cfc77084aa1c76078bbc350051ea0446ea941))

## [1.6.3](https://github.com/renatoliveira/apex-test-list/compare/v1.6.2...v1.6.3) (2024-10-21)


### Bug Fixes

* ignore cases in prefixes and allow spaces as separators ([ac2c7ed](https://github.com/renatoliveira/apex-test-list/commit/ac2c7ed717f3d7314b03c2cb31827e1028164ac1))

## [1.6.2](https://github.com/renatoliveira/apex-test-list/compare/v1.6.1...v1.6.2) (2024-10-20)


### Bug Fixes

* include colon in the regex ([7488096](https://github.com/renatoliveira/apex-test-list/commit/7488096707a56eac751fdea1482cc31af976e450))

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
