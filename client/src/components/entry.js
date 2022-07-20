import React, { useState, useEffect } from 'react';
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
  const [balance, setBalance] = useState(account.balance);

  useEffect(() => {
    setAccount(getAccount(entry.accountId));
    setBalance(account.balance);
  }, [entry.accountId]);

  const handleUpdateEntry = (e) => {
    const asset = entry.accountType === 'asset' ? 1 : -1;
    const dr = entry.type === 'debit' ? 1 : -1;
    const sign = asset * dr;

    const { name, value } = e.target;
    if (name === 'accountId') {
      const selectedAccount = getAccount(value);
      setAccount(selectedAccount);
      dispatch(
        updateEntry({ index, name: 'accountType', value: selectedAccount.type })
      );
      dispatch(
        updateEntry({ index, name: 'accountName', value: selectedAccount.name })
      );
      dispatch(updateEntry({ index, name: 'amount', value: '0' }));
    } else if (name === 'amount') {
      const newAmount = parseFloat(value) || 0;
      const oldAmount = parseFloat(entry.amount) || 0;
      setBalance(balance + sign * (newAmount - oldAmount));
    } else if (name === 'type') {
      const amount = parseFloat(entry.amount) || 0;
      setBalance(balance - 2 * sign * amount);
    }
    dispatch(updateEntry({ index, name, value }));
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
        <span>{usd.format(balance)}</span>
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
