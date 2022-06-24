const axios = require('axios');
const { host } = require('./config');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const postAccount = async ({ type, name, options }) => {
  try {
    const res = await axios.post(
      host + '/api/account',
      {
        type,
        name,
      },
      options
    );
    return res.data.id;
  } catch (err) {
    console.log(err.response.data);
  }
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

const createBudget = async ({ name, monthly, options }) => {
  try {
    const res = await axios.post(
      host + '/api/budget',
      {
        name,
        monthly,
      },
      options
    );
    return res.data.id;
  } catch (err) {
    console.log(err.response.data);
  }
};

const indexBudget = async ({ options }) => {
  try {
    const res = await axios.get(host + '/api/budget?page=1&limit=10', options);
    const budgets = {};
    res.data.budgets.forEach((budget) => {
      budgets[budget.name] = budget;
    });
    return budgets;
  } catch (err) {
    console.log(err.response.data);
  }
};

const classifyTransaction = async ({ expenseId, budgetId, options }) => {
  try {
    const res = await axios.post(
      host + '/api/budget/classify',
      {
        expenseId,
        budgetId,
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

const getAccounts = async ({ options }) => {
  try {
    const res = await axios.get(host + '/api/account', options);
    const accounts = {};
    res.data.accounts.forEach((account) => {
      account.debit = 0;
      account.credit = 0;
      account.balance = 0;
      accounts[account.name] = account;
    });
    return accounts;
  } catch (err) {
    console.log(err.response.data);
  }
};

const signin = async ({ email, password }) => {
  try {
    const res = await axios.post(host + '/api/auth/signin', {
      email,
      password,
    });
    return res.headers['set-cookie'];
  } catch (err) {
    console.log(err.response.data);
  }
};

const signup = async ({ email, password }) => {
  try {
    const res = await axios.post(host + '/api/auth/signup', {
      email,
      password,
    });
    return res.headers['set-cookie'];
  } catch (err) {
    console.log(err.response.data);
  }
};

module.exports = {
  sleep,
  signin,
  signup,
  getAccounts,
  postAccount,
  createBudget,
  indexBudget,
  classifyTransaction,
  postTransaction,
  postTransactionBatch,
};
