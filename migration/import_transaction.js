const fs = require('fs');
const {
  signin,
  getAccounts,
  indexBudget,
  postTransaction,
  classifyTransaction,
  sleep,
} = require('./utils');
const { AccountType } = require('@bookkeeping/common');
const { email, password, file, names } = require('./config');

const batch = 1;
const txn = {
  id: null,
  date: null,
  memo: null,
  entries: [],
  budget: null,
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
  const budgets = await indexBudget({ options });

  const lines = fs.readFileSync(file, 'utf-8').split(/\r?\n/);

  for (var i in lines) {
    const line = lines[i];
    var [seq, date, memo, accountName, type, amount, budget] = line.split(',');
    budget = names[budget];
    // if (parseFloat(seq) <= 6618) {
    //   continue;
    // }

    // assign for the first time
    if (!txn.id) txn.id = seq;
    if (!txn.date) txn.date = date.split(' ')[0];
    if (!txn.memo) txn.memo = memo.slice(2, memo.length - 1);
    if (!txn.budget) txn.budget = budget;

    const account = accounts[accountName.trim()];

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

      const transactionId = await postTransaction({ txn, options });
      await sleep(100);
      if (txn.budget !== 'Default') {
        await classifyTransaction({
          expenseId: transactionId,
          budgetId: budgets[txn.budget].id,
          options,
        });
        await sleep(100);
      }

      console.log(
        txn.id,
        txn.date,
        txn.memo,
        transactionId,
        txn.budget,
        budgets[txn.budget].id
      );

      // new transaction
      txn.id = seq;
      txn.date = date.split(' ')[0];
      txn.memo = memo.slice(2, memo.length - 1);
      txn.entries = [];
      txn.budget = budget;
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
