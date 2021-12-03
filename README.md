# 1pux to CSV

[![](https://github.com/BrunoBernardino/1pux-to-csv/workflows/Run%20Tests/badge.svg)](https://github.com/BrunoBernardino/1pux-to-csv/actions?workflow=Run+Tests)

This script converts a [1Password .1pux file](https://support.1password.com/1pux-format/) to a CSV file. It's been tested to be successfully imported into [Padloc](https://github.com/padloc/padloc) (`extraFields` currently ignored), but it should work for other alternatives as well.

**NOTE** Files and documents aren't supported (they'll be ignored). Feel free to open a PR for it once 1Password adds support for them.

## Usage (CLI)

Assuming you already have `npx` installed via `npm`:

```bash
npx 1pux-to-csv file.1pux
npx 1pux-to-csv file.1pux -o file.csv
```

Either of these will create a `file.csv` file with all the exported data. The first tag for every item will be the vault's name. Note that two-factor code generators (one-time passwords) are also included in this data export.

## Usage (Library)

```bash
npm install --save-exact 1pux-to-csv
```

```typescript
// If you need the types
import { OnePuxExport, OnePuxData, OnePuxItem } from '1pux-to-csv/types';

// If you need a parser function
import { parse1PuxFile, parseToRowData } from '1pux-to-csv';
```

## Development

```bash
npm install
npm run prettier
npm test
npm run build
npm run build/test
npm start file.1pux
```

## Deployment

```bash
npm version <patch|minor|major>
npm run deploy
```
