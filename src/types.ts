export type OnePuxItemDetailsLoginField = {
  value: string;
  id: string;
  name: string;
  fieldType: 'A' | 'B' | 'C' | 'E' | 'I' | 'N' | 'P' | 'R' | 'S' | 'T' | 'U';
  designation?: 'username' | 'password';
};

export type OnePuxItemDetailsSection = {
  title: string;
  name: string;
  fields: [
    {
      title: string;
      id: string;
      value: {
        concealed?: string;
        reference?: string;
        string?: string;
        email?: string;
        phone?: string;
        url?: string;
        totp?: string;
        gender?: string;
        creditCardType?: string;
        creditCardNumber?: string;
        monthYear?: number;
        date?: number;
      };
      indexAtSource: number;
      guarded: boolean;
      multiline: boolean;
      dontGenerate: boolean;
      inputTraits: {
        keyboard: string;
        correction: string;
        capitalization: string;
      };
    },
  ];
};

export type OnePuxItemDetailsPasswordHistory = {
  value: string;
  time: number;
};

export type OnePuxItemOverviewUrl = {
  label: string;
  url: string;
};

export type OnePuxItem = {
  item?: {
    uuid: string;
    favIndex: number;
    createdAt: number;
    updatedAt: number;
    trashed: boolean;
    categoryUuid: string;
    details: {
      loginFields: OnePuxItemDetailsLoginField[];
      notesPlain?: string;
      sections: OnePuxItemDetailsSection[];
      passwordHistory: OnePuxItemDetailsPasswordHistory[];
      documentAttributes?: {
        fileName: string;
        documentId: string;
        decryptedSize: number;
      };
    };
    overview: {
      subtitle: string;
      urls?: OnePuxItemOverviewUrl[];
      title: string;
      url: string;
      ps?: number;
      pbe?: number;
      pgrng?: boolean;
      tags?: string[];
    };
  };
  file?: {
    attrs: {
      uuid: string;
      name: string;
      type: string;
    };
    path: string;
  };
};

export type OnePuxVault = {
  attrs: {
    uuid: string;
    desc: string;
    avatar: string;
    name: string;
    type: 'P' | 'E' | 'U';
  };
  items: OnePuxItem[];
};

export type OnePuxAccount = {
  attrs: {
    accountName: string;
    name: string;
    avatar: string;
    email: string;
    uuid: string;
    domain: string;
  };
  vaults: OnePuxVault[];
};

export type OnePuxData = {
  accounts: OnePuxAccount[];
};

export type OnePuxAttributes = {
  version: number;
  description: string;
  createdAt: number;
};

export type OnePuxExport = {
  attributes: OnePuxAttributes;
  data: OnePuxData;
};
