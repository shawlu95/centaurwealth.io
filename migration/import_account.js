const fs = require('fs');
const { signup, signin, postAccount } = require('./utils');
const { AccountType } = require('@bookkeeping/common');
const { email, password, file } = require('./config');

const typeMap = {
  'SFCU Checking': AccountType.Asset,
  'Wechat Cash': AccountType.Asset,
  'PP&E': AccountType.Asset,
  'Account Receivable': AccountType.Asset,
  Supply: AccountType.Asset,
  Prepaid: AccountType.Asset,
  'Prepaid Tax': AccountType.Asset,
  'Cash USD': AccountType.Asset,
  'Cash CNY': AccountType.Asset,
  Securities: AccountType.Asset,
  'Roth IRA': AccountType.Asset,
  'Tra IRA': AccountType.Asset,
  Crypto: AccountType.Asset,
  '401k': AccountType.Asset,
  Options: AccountType.Asset,
  'Health Saving Account': AccountType.Asset,
  'SFCU Credit': AccountType.Liability,
  Payable: AccountType.Liability,
  'Retained Earning': AccountType.Equity,
  Expense: AccountType.Temporary,
  Earning: AccountType.Temporary,
  Loss: AccountType.Temporary,
  Gain: AccountType.Temporary,
  Unrealized: AccountType.Temporary,
};

(async function processLineByLine() {
  await signup({ email, password });
  const cookie = await signin({ email, password });

  const options = {
    headers: {
      Cookie: cookie,
      withCredentials: true,
    },
  };

  const accounts = {};

  await postAccount({
    type: AccountType.Temporary,
    name: 'Error',
    options,
  });

  const lines = fs.readFileSync(file, 'utf-8').split(/\r?\n/);

  for (var i in lines) {
    const line = lines[i];
    var [seq, date, memo, account, type, amount] = line.split(',');
    account = account.trim();

    if (!accounts[account]) {
      // try to create account
      accounts[account] = true;
      await postAccount({
        type: typeMap[account],
        name: account,
        options,
      });
    }
  }
})();
