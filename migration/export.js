#!/usr/local/bin/node
const axios = require('axios');
const fs = require('fs');
const { signin, indexBudget } = require('./utils');
const { email, password, host } = require('./config');

(async () => {
  const cookie = await signin({ email, password });
  const options = {
    headers: {
      Cookie: cookie,
      withCredentials: true,
    },
  };
  try {
    const acc = await axios.get(host + '/api/account', options);
    const bud = await axios.get(host + '/api/budget', {
      ...options,
      params: { page: 1, limit: 1000000 },
    });
    const txn = await axios.get(host + '/api/transaction', {
      ...options,
      params: { page: 1, limit: 1000000 },
    });

    const accounts = acc.data.accounts;
    const budgets = bud.data.budgets;
    const transactions = txn.data.transactions.docs;
    const expenses = bud.data.expenses.docs;
    fs.writeFileSync('./data/accounts.json', JSON.stringify(accounts, null, 2));
    fs.writeFileSync('./data/budgets.json', JSON.stringify(budgets, null, 2));
    fs.writeFileSync('./data/expenses.json', JSON.stringify(expenses, null, 2));
    fs.writeFileSync(
      './data/transactions.json',
      JSON.stringify(transactions.reverse(), null, 2)
    );
    console.log('exported accounts:', accounts.length);
    console.log('exported budgets:', budgets.length);
    console.log('exported expenses:', expenses.length);
    console.log('exported transactions:', transactions.length);
  } catch (err) {
    console.log(err);
  }
})();
