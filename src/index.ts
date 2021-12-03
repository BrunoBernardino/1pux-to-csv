#! /usr/bin/env ts-node

import { writeFileSync, readFileSync } from 'fs';
import { extname } from 'path';
import { Command } from 'commander';

import { parse1PuxFile, convert1PuxDataToCSV } from './parser';

const program = new Command();

const convert = async (inputFile: string, options: { outputFile?: string }) => {
  const fileContents = readFileSync(inputFile, { encoding: null });
  const parsedExport = await parse1PuxFile(fileContents);
  const csvString = await convert1PuxDataToCSV(parsedExport.data);

  let { outputFile } = options;

  // Generate output file name, if none was given
  if (!outputFile) {
    const inputFileExtension = extname(inputFile);
    if (!inputFileExtension) {
      outputFile = `${inputFile}.csv`;
    } else {
      outputFile = inputFile.replace(
        new RegExp(`\\${inputFileExtension}$`, 'gi'),
        '.csv',
      );
    }
  }

  console.log(`Writing CSV file: "${outputFile}"...`);
  writeFileSync(outputFile, csvString, { encoding: 'utf-8' });
};

program
  .command('convert <inputFile>', { isDefault: true })
  .option('-o, --output-file <outputFile>', 'CSV output file path')
  .description('Converts 1pux file to CSV')
  .action(convert);

program.parse(process.argv);
