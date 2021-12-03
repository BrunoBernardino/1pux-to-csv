import { loadAsync } from 'jszip';

import { OnePuxData, OnePuxItem, OnePuxExport } from './types';

export const parse1PuxFile = async (fileContents: string | Buffer) => {
  try {
    const zip = await loadAsync(fileContents);

    const attributesContent = await zip
      .file('export.attributes')
      .async('string');
    const attributes = JSON.parse(attributesContent);
    const dataContent = await zip.file('export.data').async('string');
    const data = JSON.parse(dataContent);

    return {
      attributes,
      data,
    } as OnePuxExport;
  } catch (error) {
    console.error('Failed to parse .1pux file');
    throw error;
  }
};

const escapeCSVValue = (value: string | number) => {
  if (value === null || typeof value === 'undefined') {
    return '';
  }

  if (typeof value !== 'string') {
    return value.toString();
  }

  // Just return the value if there's no special character
  if (
    !value.includes(',') &&
    !value.includes(' ') &&
    !value.includes('"') &&
    !value.includes('\n')
  ) {
    return value;
  }

  return `"${value.replace(/"/g, '""').replace(/\n/g, '  ')}"`;
};

type RowData = {
  name: string;
  tags: string;
  url: string;
  username: string;
  password: string;
  notes: string;
  extraFields: string;
};

type ExtraField = { name: string; value: string };

export const parseToRowData = (
  item: OnePuxItem['item'],
  defaultTags?: string[],
) => {
  const rowData: RowData = {
    name: item.overview.title,
    tags: [...(defaultTags || []), ...(item.overview.tags || [])].join(','),
    url: item.overview.url || '',
    username: '',
    password: '',
    notes: item.details.notesPlain || '',
    extraFields: '',
  };

  // Skip documents
  if (
    item.details.documentAttributes &&
    item.details.loginFields.length === 0
  ) {
    return;
  }

  const extraFields: ExtraField[] = [];

  // Extract username, password, and some extraFields
  item.details.loginFields.forEach((field) => {
    if (field.designation === 'username') {
      rowData.username = field.value;
    } else if (field.designation === 'password') {
      rowData.password = field.value;
    } else if (
      field.fieldType === 'I' ||
      field.fieldType === 'C' ||
      field.id.includes(';opid=__') ||
      field.value === ''
    ) {
      // Skip these noisy form-fields
      return;
    } else {
      extraFields.push({
        name: field.name || field.id,
        value: field.value,
      });
    }
  });

  // Extract some more extraFields
  item.details.sections.forEach((section) => {
    section.fields.forEach((field) => {
      let value = '';

      if (Object.prototype.hasOwnProperty.call(field.value, 'concealed')) {
        value = field.value.concealed || '';
      } else if (
        Object.prototype.hasOwnProperty.call(field.value, 'reference')
      ) {
        value = field.value.reference || '';
      } else if (Object.prototype.hasOwnProperty.call(field.value, 'string')) {
        value = field.value.string || '';
      } else if (Object.prototype.hasOwnProperty.call(field.value, 'email')) {
        value = field.value.email || '';
      } else if (Object.prototype.hasOwnProperty.call(field.value, 'phone')) {
        value = field.value.phone || '';
      } else if (Object.prototype.hasOwnProperty.call(field.value, 'url')) {
        value = field.value.url || '';
      } else if (Object.prototype.hasOwnProperty.call(field.value, 'totp')) {
        value = field.value.totp || '';
      } else if (Object.prototype.hasOwnProperty.call(field.value, 'gender')) {
        value = field.value.gender || '';
      } else if (
        Object.prototype.hasOwnProperty.call(field.value, 'creditCardType')
      ) {
        value = field.value.creditCardType || '';
      } else if (
        Object.prototype.hasOwnProperty.call(field.value, 'creditCardNumber')
      ) {
        value = field.value.creditCardNumber || '';
      } else if (
        Object.prototype.hasOwnProperty.call(field.value, 'monthYear')
      ) {
        value =
          (field.value.monthYear && field.value.monthYear.toString()) || '';
      } else if (Object.prototype.hasOwnProperty.call(field.value, 'date')) {
        value = (field.value.date && field.value.date.toString()) || '';
      } else {
        // Default, so no data is lost when something new comes up
        value = JSON.stringify(field.value);
      }

      extraFields.push({
        name: field.title || field.id,
        value,
      });
    });
  });

  rowData.extraFields = JSON.stringify(extraFields);

  return rowData;
};

const convertDataToRow = (rowData: RowData) => {
  const row = [
    rowData.name,
    rowData.tags,
    rowData.url,
    rowData.username,
    rowData.password,
    rowData.notes,
    rowData.extraFields,
  ]
    .map(escapeCSVValue)
    .join(',');

  return row;
};

export const convert1PuxDataToCSV = async (onePuxData: OnePuxData) => {
  const rows = ['name,tags,url,username,password,notes,extraFields'];

  onePuxData.accounts.forEach((account) => {
    account.vaults.forEach((vault) => {
      vault.items.forEach((item) => {
        if (item.item && !item.item.trashed) {
          const rowData = parseToRowData(item.item, [vault.attrs.name]);

          if (rowData) {
            rows.push(convertDataToRow(rowData));
          }
        }
      });
    });
  });

  return rows.join('\n');
};
