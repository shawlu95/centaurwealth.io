import React, { useEffect } from 'react';
import Transactions from '../../components/transactions';
import { useSelector, useDispatch } from 'react-redux';
import { getTransactions } from '../../features/transaction/transactionSlice';
import { Link } from 'react-router-dom';

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
      <Link to='/transaction/create' className='btn btn-primary w-100'>
        New Transaction
      </Link>
    </div>
  );
};

export default TransactionIndex;

import TransactionClose from './close';
import TransactionCreate from './create';
import TransactionDetail from './detail';

export { TransactionClose, TransactionCreate, TransactionDetail };
