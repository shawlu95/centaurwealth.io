const email = 'shawlu95@gmail.com';
const password = '1234';
const file = '/Users/shaw.lu/Downloads/2022-06-24_entries.csv';
const host = 'http://centaurwealth.dev';
// const host = 'http://www.centaurwealth.io';

const names = {
  None: 'Default',
  TAX: 'Tax',
  ELE: 'Electronics',
  TRA: 'Transport',
  STA: 'Stationery',
  LEG: 'Legal',
  FUR: 'Furniture',
  FOO: 'Food',
  PET: 'Pet',
  LOV: 'Love',
  SOF: 'Software',
  SAR: 'Sartorial',
  HYG: 'Hiegyne',
  ENT: 'Entertainment',
  CLO: 'Clothing',
  ACC: 'Accessory',
  HOU: 'Housing',
  BOO: 'Book',
  SOC: 'Social',
  COM: 'Communication',
  INS: 'Insurance',
  AUT: 'Car',
  MIS: 'Miscellany',
  EDU: 'Education',
  SHO: 'Shoes',
  MOM: 'Mom',
  DON: 'Charity',
  ADM: '_Close',
};

const amounts = {
  None: 0,
  TAX: 3500,
  ELE: 200,
  TRA: 50,
  STA: 10,
  LEG: 10,
  FUR: 50,
  FOO: 450,
  PET: 100,
  LOV: 50,
  SOF: 50,
  SAR: 10,
  HYG: 30,
  ENT: 200,
  CLO: 10,
  ACC: 10,
  HOU: 3100,
  BOO: 100,
  SOC: 400,
  COM: 100,
  INS: 200,
  AUT: 350,
  MIS: 200,
  EDU: 100,
  SHO: 10,
  MOM: 500,
  DON: 100,
  ADM: 10000,
};

module.exports = { email, password, file, host, names, amounts };
