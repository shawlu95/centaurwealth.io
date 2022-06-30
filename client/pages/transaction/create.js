import React from 'react';
import Transaction from '../../components/transaction';

const TransactionCreate = ({ accounts, transaction }) => {
  return (
    <div>
      <h4>New Transaction</h4>
      <Transaction transaction={transaction} accounts={accounts} />
    </div>
  );
};

TransactionCreate.getInitialProps = async (context, axios, currentUser) => {
  const {
    data: { accounts },
  } = await axios.get('/api/balance/current');

  // Default accounts are guaranteed to exist
  const expense = accounts.filter((a) => a.name === 'Expense')[0];

  const transaction = {
    memo: '',
    date: new Date().toISOString(),
    entries: [
      {
        amount: 0,
        type: 'credit',
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

export default TransactionCreate;
