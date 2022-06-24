const fs = require('fs');
const {
  signup,
  signin,
  getAccounts,
  postAccount,
  createBudget,
  sleep,
  postTransaction,
  classifyTransaction,
  indexBudget,
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

  var budgets = readJson('./data/budgets.json');
  for (var i in budgets) {
    await createBudget({
      name: budgets[i].name,
      monthly: budgets[i].monthly,
      options,
    });
  }

  const expenses = readJson('./data/expenses.json');
  const expensesMap = {};
  for (var i in expenses) {
    expensesMap[expenses[i].id] = expenses[i].budget.name;
  }

  accounts = await getAccounts({ options });
  budgets = await indexBudget({ options });

  const transactions = readJson('./data/transactions.json');
  for (var i = 0; i < transactions.length; i++) {
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
    const transactionId = await postTransaction({ txn: transaction, options });
    console.log(`transaction: ${transaction.date} ${i}/${transactions.length}`);
    await sleep(100);

    const budget = expensesMap[transaction.id];
    if (budget) {
      await classifyTransaction({
        expenseId: transactionId,
        budgetId: budgets[budget].id,
        options,
      });

      console.log(`transaction grouped into: ${budget}`);
      await sleep(100);
    }
  }
  console.log('transactions:', transactions.length);
  console.log(accounts);
})();
