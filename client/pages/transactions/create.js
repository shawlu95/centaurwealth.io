import React from 'react';
import Transaction from '../../components/transaction';

export default function TransactionForm({ accounts, transaction }) {
  return <Transaction transaction={transaction} accounts={accounts} />;
}

TransactionForm.getInitialProps = async (context, axios, currentUser) => {
  const {
    data: { accounts },
  } = await axios.get('/api/balance/current');

  const transaction = {
    memo: '',
    date: new Date().toISOString(),
    debitAccountId: accounts[0].id,
    creditAccountId: accounts[0].id,
    amount: 0,
  };

  return { accounts, transaction, currentUser };
};
