import React, { useEffect } from 'react';
import { PageButtonContianer, Transactions } from '../../components';
import { useSelector, useDispatch } from 'react-redux';
import { getTransactions } from '../../features/transaction/transactionSlice';
import { setPage } from '../../features/transaction/transactionSlice';
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
      <PageButtonContianer
        page={transactions.page}
        totalPages={transactions.totalPages}
        setPage={setPage}
      />
      <Link to='/transaction/create' className='btn btn-primary'>
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
