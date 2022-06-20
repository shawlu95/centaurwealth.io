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
    fs.writeFileSync(
      './data/accounts.json',
      JSON.stringify(acc.data.accounts, null, 2)
    );
    fs.writeFileSync(
      './data/transactions.json',
      JSON.stringify(txn.data.transactions.docs, null, 2)
    );
  } catch (err) {
    console.log(err);
  }
  console.log('hh');
})();
