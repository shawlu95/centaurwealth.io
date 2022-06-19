import React from 'react';
import Transaction from '../../components/transaction';

const TransactionsCreate = ({ accounts, transaction }) => {
  return <Transaction transaction={transaction} accounts={accounts} />;
};

TransactionsCreate.getInitialProps = async (context, axios, currentUser) => {
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

export default TransactionsCreate;
