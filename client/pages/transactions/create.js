import React from 'react';
import Transaction from '../../components/transaction';

export default function TransactionForm({ accounts, initValues }) {
  return <Transaction transaction={initValues} accounts={accounts} />;
}

TransactionForm.getInitialProps = async (context, axios, currentUser) => {
  const { data } = await axios.get('/api/balance/current');

  const initValues = {
    memo: '',
    date: new Date().toISOString(),
    debitAccountId: data.accounts[0].id,
    creditAccountId: data.accounts[0].id,
    amount: 0,
  };

  return { accounts: data.accounts, initValues, currentUser };
};
