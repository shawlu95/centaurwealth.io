import { Grid } from '@mui/material';
import { useState } from 'react';

const Entry = ({ index, accounts, entry, entries, setEntries }) => {
  const getAccount = (id) => accounts.filter((acc) => acc.id === id)[0];

  const setAccountId = (e) => {
    const accountId = e.target.value;
    const account = getAccount(accountId);
    const accountName = account.name;
    const accountType = account.type;
    const updated = entries.map((_entry, _index) => {
      if (_index === index) {
        return { ..._entry, accountId, accountName, accountType };
      }
      return _entry;
    });
    setEntries(updated);
  };

  const setType = (e) => {
    e.preventDefault();
    const updated = entries.map((_entry, _index) => {
      if (_index === index) {
        return { ..._entry, type: e.target.value };
      }
      return _entry;
    });
    setEntries(updated);
  };

  const setAmount = (e) => {
    e.preventDefault();
    const updated = entries.map((_entry, _index) => {
      if (_index === index) {
        return { ..._entry, amount: parseFloat(e.target.value) };
      }
      return _entry;
    });
    setEntries(updated);
  };

  const deleteEntry = (e) => {
    e.preventDefault();
    const updated = entries.filter((_entry, _index) => index !== _index);
    setEntries(updated);
  };

  return (
    <div className='row'>
      <div className='col-sm-6'>
        <select
          className='form-control'
          name='accountId'
          value={entry.accountId}
          onChange={setAccountId}
        >
          {accounts.map((account) => (
            <option value={account.id} key={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className='col-sm-2'>
        <select
          className='form-control'
          name='entryType'
          value={entry.type}
          onChange={setType}
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
          onChange={setAmount}
        />
      </div>

      <div className='col-sm-2'>
        <button
          onClick={deleteEntry}
          className='btn btn-outline-secondary w-100'
        >
          - Entry
        </button>
      </div>
    </div>
  );
};

export default Entry;
