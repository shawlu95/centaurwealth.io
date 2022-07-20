import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Transactions, PageButtonContianer } from '../../components';
import { usd } from '../../utils';
import { useSelector, useDispatch } from 'react-redux';
import { getAccount } from '../../features/account/accountSlice';
import {
  addEntry,
  resetTransaction,
  setPage,
} from '../../features/transaction/transactionSlice';

const AccountHistory = () => {
  const dispatch = useDispatch();
  const { accountId } = useParams();
  const { account } = useSelector((store) => store.account);
  const { transactions } = useSelector((store) => store.transaction);
  const { totalPages, page } = transactions;

  useEffect(() => {
    dispatch(getAccount(accountId));
  }, [transactions.page]);

  const addEntryWithCurrentAccount = () => {
    dispatch(resetTransaction());
    const entry = {
      amount: '0',
      type: 'debit',
      accountId,
      accountName: account.name,
      accountType: account.type,
    };
    dispatch(addEntry({ entry }));
  };

  return (
    <div className='container d-grid gap-2'>
      <div className='row'>
        <h4>{account.name}</h4>
        <b>Balance: {usd.format(account.balance)}</b>
      </div>
      <Transactions />
      <PageButtonContianer
        totalPages={totalPages}
        page={page}
        setPage={setPage}
      />
      <Link
        to={`/account/detail/${account.id}`}
        className='btn btn-primary'
        disabled={!account.mutable}
      >
        Update Account
      </Link>
      <Link
        to='/transaction/create'
        className='btn btn-secondary'
        onClick={addEntryWithCurrentAccount}
      >
        New Transaction
      </Link>
    </div>
  );
};

export default AccountHistory;
