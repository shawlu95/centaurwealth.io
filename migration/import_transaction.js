const fs = require('fs');
const { signin, getAccounts, postTransaction } = require('./utils');
const { AccountType } = require('@bookkeeping/common');
const { email, password } = require('./config');

const txn = {
  id: null,
  date: null,
  memo: null,
  entries: [],
};

(async function processLineByLine() {
  const cookie = await signin({ email, password });

  const options = {
    headers: {
      Cookie: cookie,
      withCredentials: true,
    },
  };

  const accounts = await getAccounts({ options });

  const lines = fs
    .readFileSync('/Users/shaw.lu/Downloads/2022-06-14_entries.csv', 'utf-8')
    .split(/\r?\n/);

  for (var i in lines) {
    const line = lines[i];
    var [seq, date, memo, account, type, amount] = line.split(',');

    // assign for the first time
    if (!txn.id) txn.id = seq;
    if (!txn.date) txn.date = date.split(' ')[0];
    if (!txn.memo) txn.memo = memo.slice(2, memo.length - 1);

    account = accounts[account.trim()];
    if (seq != txn.id) {
      // transaction complete
      var debit = 0;
      var credit = 0;
      txn.entries.forEach((entry) => {
        if (entry.type === 'debit') debit += entry.amount;
        if (entry.type === 'credit') credit += entry.amount;
      });
      if (credit != debit) {
        txn.entries.push({
          amount: Math.abs(credit - debit),
          type: credit > debit ? 'debit' : 'credit',
          accountName: 'Error',
          accountType: AccountType.Temporary,
          accountId: accounts['Error'].id,
        });
      }
      await postTransaction({ txn, options });

      // new transaction
      txn.id = seq;
      txn.date = date.split(' ')[0];
      txn.memo = memo.slice(2, memo.length - 1);
      txn.entries = [];
    }

    txn.entries.push({
      amount: parseFloat(amount),
      type: { DR: 'debit', CR: 'credit' }[type],
      accountName: account.name,
      accountType: account.type,
      accountId: account.id,
    });
  }

  // last transaction
  await postTransaction({ txn, options });
})();