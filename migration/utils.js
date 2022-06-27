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
  console.log(name, monthly);
  try {
    const res = await axios.post(
      host + '/api/budget',
      {
        name,
        monthly,
      },
      options
    );
    console.log(res.data.budget);
    return res.data.budget;
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

const getDelta = (type, entries) => {
  var sign = 0;
  if (type === 'asset') sign = 1;
  if (type === 'liability') sign = -1;
  var delta = 0;

  for (var i in entries) {
    const entry = entries[i];
    if (entry.accountType === type) {
      if (entry.type === 'debit') {
        delta += sign * entry.amount;
      } else if (entry.type === 'credit') {
        delta -= sign * entry.amount;
      }
    }
  }
  return Math.round(delta * 100) / 100;
};

const getTimeline = async ({ start, options }) => {
  try {
    const res = await axios.get(host + '/api/timeline', {
      params: { start },
      ...options,
    });
    const points = {};
    res.data.points.forEach((x) => {
      points[x.date] = x;
    });
    return points;
  } catch (err) {
    console.log(err.response.data);
  }
};

const updateTimeline = async ({ date, asset, liability, options }) => {
  try {
    const res = await axios.patch(
      host + '/api/timeline',
      {
        date,
        asset,
        liability,
      },
      options
    );
    console.log('updated', res.data.point);
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
  getDelta,
  getTimeline,
  updateTimeline,
};
