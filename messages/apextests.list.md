# summary

List

# description

Lists tests in a package.xml file or from your package directories.

# flags.format.summary

Format of the output.

# flags.format.description

By default, the format being returned is a list in the format that can be merged with the test flags of the Salesforce CLI deploy and validate commands. Available formats are `sf` (default) and `csv`.

# flags.manifest.summary

Manifest XML file.

# flags.manifest.description

When you specify a manifest file, the plugin will not search directories for all classes with annotations, but instead will read the manifest file and search for those classes within your package directories.

# flags.ignore-missing-tests.summary

Ignore missing test methods.

# flags.ignore-missing-tests.description

If provided, ignore test methods that are not found in any of the package directories.

# flags.ignore-package-directory.summary

Ignore a package directory.

# flags.ignore-package-directory.description

If provided, do not search the package directory for test annotations.

# examples

- <%= config.bin %> <%= command.id %> --format csv
- <%= config.bin %> <%= command.id %> --format sf
- <%= config.bin %> <%= command.id %> --format sf --manifest package.xml
- <%= config.bin %> <%= command.id %> --format sf --manifest package.xml --ignore-missing-tests
- <%= config.bin %> <%= command.id %> --format sf --manifest package.xml -d "force-app"
