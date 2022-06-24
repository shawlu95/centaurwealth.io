#!/usr/local/bin/node
const axios = require('axios');
const fs = require('fs');
const { signin } = require('./utils');
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
    const txn = await axios.get(host + '/api/transaction', {
      ...options,
      params: { page: 1, limit: 1000000 },
    });
    const accounts = acc.data.accounts;
    const transactions = txn.data.transactions.docs;
    fs.writeFileSync('./data/accounts.json', JSON.stringify(accounts, null, 2));
    fs.writeFileSync(
      './data/transactions.json',
      JSON.stringify(transactions.reverse(), null, 2)
    );
    console.log('exported accounts:', accounts.length);
    console.log('exported transactions:', transactions.length);
  } catch (err) {
    console.log(err);
  }
})();
