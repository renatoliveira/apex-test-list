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

# examples

- <%= config.bin %> <%= command.id %> --format csv
- <%= config.bin %> <%= command.id %> --format sf
- <%= config.bin %> <%= command.id %> --format sf --manifest package.xml
