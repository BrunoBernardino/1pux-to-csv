import { readFileSync } from 'fs';
import { join } from 'path';

import { parse1PuxFile, convert1PuxDataToCSV } from '../parser';

const exampleAttributesFile = join(__dirname, 'example', 'export.attributes');
const exampleDataFile = join(__dirname, 'example', 'export.data');
const exampleInputFile = join(__dirname, 'example.1pux');

test('Parsing of example.1pux file', async () => {
  const exampleInputFileContents = readFileSync(exampleInputFile);
  const parsedData = await parse1PuxFile(exampleInputFileContents);
  const exampleAttributes = JSON.parse(
    readFileSync(exampleAttributesFile, { encoding: 'utf-8' }),
  );
  const exampleData = JSON.parse(
    readFileSync(exampleDataFile, { encoding: 'utf-8' }),
  );

  expect(parsedData).toStrictEqual({
    attributes: exampleAttributes,
    data: exampleData,
  });
});

test('Converting of parsed example.1pux file', async () => {
  const exampleInputFileContents = readFileSync(exampleInputFile);
  const parsedData = await parse1PuxFile(exampleInputFileContents);
  const csvString = await convert1PuxDataToCSV(parsedData.data);

  expect(csvString).toEqual(
    `name,tags,url,username,password,notes,extraFields
Dropbox,"Personal,one-tag,another tag",https://www.dropbox.com/,user@example.com,most-secure-password-ever!,"This is a note. *bold*! _italic_!","${JSON.stringify(
      [
        { name: 'PIN', value: '12345' },
        {
          name: 'one-time password',
          value:
            'otpauth://totp/Dropbox:user@example.com?secret=FAKEONE&issuer=Dropbox',
        },
      ],
    ).replace(/"/g, '""')}"`,
  );
});
