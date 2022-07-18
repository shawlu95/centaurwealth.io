import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Transactions from '../../components/transactions';
import { usd } from '../../utils';
import { useSelector, useDispatch } from 'react-redux';
import { getAccount } from '../../features/account/accountSlice';
import PageButtonContianer from '../../components/PageButtonContianer';

const AccountHistory = () => {
  const dispatch = useDispatch();
  const { accountId } = useParams();
  const { account } = useSelector((store) => store.account);
  const { transactions } = useSelector((store) => store.transaction);

  useEffect(() => {
    dispatch(getAccount(accountId));
  }, [transactions.page]);

  return (
    <div className='container d-grid gap-2'>
      <div className='row'>
        <h4>{account.name}</h4>
        <b>Balance: {usd.format(account.balance)}</b>
      </div>

      <div className='row'>
        <Transactions />
      </div>
      <PageButtonContianer />

      <div className='row'>
        <Link
          to={`/account/detail/${account.id}`}
          className='btn btn-primary w-100'
          disabled={!account.mutable}
        >
          Update Account
        </Link>
      </div>

      <div className='row'>
        <Link to='/transaction/create' className='btn btn-secondary w-100'>
          New Transaction
        </Link>
      </div>
    </div>
  );
};

export default AccountHistory;
