const fs = require('fs');

const readJson = (path) => {
  let data = fs.readFileSync(path);
  return JSON.parse(data);
};

(async () => {
  var accounts = readJson('./data/good/accounts.json');
  const accountsMap = {};
  for (var i in accounts) {
    const account = accounts[i];
    account.debit = 0;
    account.credit = 0;
    account.balance = 0;
    accountsMap[account.id] = account;
  }
  console.log('accounts:', accounts.length);

  const transactions = readJson('./data/good/transactions.json');
  for (var i = transactions.length - 1; i >= 0; i--) {
    const transaction = transactions[i];
    for (var j in transaction.entries) {
      const entry = transaction.entries[j];
      const account = accountsMap[entry.accountId];

      if (entry.type == 'debit') {
        account.debit += entry.amount;
        account.balance += entry.amount;
      } else if (entry.type === 'credit') {
        account.credit -= entry.amount;
        account.balance -= entry.amount;
      }
    }
  }
  console.log('transactions:', transactions.length);
  console.log(accountsMap);
})();
