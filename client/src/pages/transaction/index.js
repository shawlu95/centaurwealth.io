import React, { useEffect } from 'react';
import Transactions from '../../components/transactions';
import { useSelector, useDispatch } from 'react-redux';
import { getTransactions } from '../../features/transaction/transactionSlice';

const TransactionIndex = () => {
  const dispatch = useDispatch();
  const { transactions } = useSelector((store) => store.transaction);

  useEffect(() => {
    dispatch(getTransactions());
  }, [transactions.page]);

  return (
    <div className='container d-grid gap-2'>
      <h3>Transactions</h3>
      <Transactions />
      <button className='btn btn-primary w-100'>New Transaction</button>
    </div>
  );
};

export default TransactionIndex;
