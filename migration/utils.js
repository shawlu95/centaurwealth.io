const axios = require('axios');
const { host } = require('./config');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const postAccount = async ({ type, name, options }) => {
  const res = await axios.post(
    host + '/api/account',
    {
      type,
      name,
    },
    options
  );
  return res.data.id;
};

const postTransaction = async ({ txn, options }) => {
  try {
    const res = await axios.post(
      host + '/api/transaction',
      {
        memo: txn.memo,
        date: txn.date,
        entries: txn.entries,
      },
      options
    );
    return res.data.id;
  } catch (err) {
    console.log(err.response.data);
  }
};

const postTransactionBatch = async ({ transactions, options }) => {
  try {
    const res = await axios.post(
      host + '/api/transaction/import',
      { transactions },
      options
    );
    return res.data.id;
  } catch (err) {
    console.log(err.response.data);
  }
};

const getAccounts = async ({ id, options }) => {
  const res = await axios.get(host + '/api/account', options);
  const accounts = {};
  res.data.accounts.forEach((account) => {
    accounts[account.name] = account;
  });
  return accounts;
};

const signin = async ({ email, password }) => {
  const res = await axios.post(host + '/api/users/signin', {
    email,
    password,
  });
  return res.headers['set-cookie'];
};

const signup = async ({ email, password }) => {
  const res = await axios.post(host + '/api/users/signup', {
    email,
    password,
  });
  return res.headers['set-cookie'];
};

module.exports = {
  sleep,
  signin,
  signup,
  getAccounts,
  postAccount,
  postTransaction,
  postTransactionBatch,
};
