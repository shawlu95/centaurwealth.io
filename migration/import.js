const fs = require('fs');
const {
  signup,
  signin,
  getAccounts,
  postAccount,
  sleep,
  postTransaction,
} = require('./utils');
const { email, password, file } = require('./config');

const readJson = (path) => {
  let data = fs.readFileSync(path);
  return JSON.parse(data);
};

(async () => {
  await signup({ email, password });
  const cookie = await signin({ email, password });

  const options = {
    headers: {
      Cookie: cookie,
      withCredentials: true,
    },
  };

  var accounts = readJson('./data/accounts.json');
  for (var i in accounts) {
    await postAccount({
      type: accounts[i].type,
      name: accounts[i].name,
      options,
    });
    await sleep(100);
  }
  console.log('accounts:', accounts.length);

  accounts = await getAccounts({ options });
  const transactions = readJson('./data/transactions.json');
  for (var i = transactions.length - 1; i >= 0; i--) {
    const transaction = transactions[i];
    for (var j in transaction.entries) {
      const entry = transaction.entries[j];
      const account = accounts[entry.accountName];
      entry.accountId = account.id;

      if (entry.type == 'debit') {
        account.debit += entry.amount;
        account.balance += entry.amount;
      } else if (entry.type === 'credit') {
        account.credit -= entry.amount;
        account.balance -= entry.amount;
      }
    }
    postTransaction({ txn: transaction, options });
    console.log(`transaction: ${transaction.date} ${i}/${transactions.length}`);
    await sleep(200);
  }
  console.log('transactions:', transactions.length);
  console.log(accounts);
})();
