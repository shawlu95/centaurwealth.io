import React from 'react';
import Transaction from '../../components/transaction';

const TransactionsCreate = ({ accounts, transaction }) => {
  return <Transaction transaction={transaction} accounts={accounts} />;
};

TransactionsCreate.getInitialProps = async (context, axios, currentUser) => {
  const {
    data: { accounts },
  } = await axios.get('/api/balance/current');

  // Default accounts are guaranteed to exist
  const cash = accounts.filter((a) => a.name === 'Cash')[0];
  const expense = accounts.filter((a) => a.name === 'Expense')[0];

  const transaction = {
    memo: '',
    date: new Date().toISOString(),
    entries: [
      {
        amount: 0,
        type: 'credit',
        accountName: cash.name,
        accountType: cash.type,
        accountId: cash.id,
      },
      {
        amount: 0,
        type: 'debit',
        accountName: expense.name,
        accountType: expense.type,
        accountId: expense.id,
      },
    ],
  };

  return { accounts, transaction, currentUser };
};

export default TransactionsCreate;
