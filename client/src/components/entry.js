import React, { useState } from 'react';
import { usd } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteEntry,
  updateEntry,
} from '../features/transaction/transactionSlice';

const Entry = ({ index, entry }) => {
  const dispatch = useDispatch();
  const { accounts } = useSelector((store) => store.account);
  const getAccount = (id) => accounts.filter((acc) => acc.id === id)[0];
  const [account, setAccount] = useState(getAccount(entry.accountId));

  const handleUpdateEntry = (e) => {
    const { name, value } = e.target;
    dispatch(updateEntry({ index, name, value }));
    if (name === 'accountId') {
      const selectedAccount = getAccount(value);
      setAccount(selectedAccount);
      dispatch(
        updateEntry({ index, name: 'accountType', value: selectedAccount.type })
      );
      dispatch(
        updateEntry({ index, name: 'accountName', value: selectedAccount.name })
      );
    }
  };

  return (
    <div className='row'>
      <div className='col-sm-4'>
        <select
          className='form-control'
          name='accountId'
          value={entry.accountId}
          onChange={handleUpdateEntry}
        >
          {accounts.map((account) => (
            <option value={account.id} key={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className='col-sm-2'>
        <span>{usd.format(parseFloat(account.balance))}</span>
      </div>

      <div className='col-sm-2'>
        <select
          className='form-control'
          name='type'
          value={entry.type}
          onChange={handleUpdateEntry}
        >
          <option value='debit' key='debit'>
            Debit
          </option>
          <option value='credit' key='credit'>
            Credit
          </option>
        </select>
      </div>

      <div className='col-sm-2'>
        <input
          className='form-control'
          name='amount'
          value={entry.amount === 0 ? '' : entry.amount}
          onChange={handleUpdateEntry}
        />
      </div>

      <div className='col-sm-2'>
        <button
          onClick={() => dispatch(deleteEntry({ index }))}
          className='btn btn-outline-secondary w-100'
        >
          - Entry
        </button>
      </div>
    </div>
  );
};

export default Entry;
