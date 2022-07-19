import React from 'react';
import { useState } from 'react';
import Entry from './entry';

const Transaction = ({ transaction, accounts, closing }) => {
  const isNew = transaction.id === undefined;

  const addEntry = (e) => {
    e.preventDefault();
    const entry = { ...entries[entries.length - 1] };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
  };

  const transactionDetail = (
    <div className='row'>
      <div className='col-sm-9'>
        <b>Memo</b>
        <input
          className='form-control'
          name='memo'
          value={transaction.memo}
          onChange={handleInputChange}
        />
      </div>
      <div className='col-sm-3'>
        <b>Date</b>
        <input
          className='form-control'
          type='date'
          name='date'
          disabled={closing || !isNew}
          value={transaction.date.split('T')[0]}
          onChange={handleInputChange}
        ></input>
      </div>
    </div>
  );

  const header = (
    <div className='row'>
      <div className='col-sm-4'>
        <b>Account</b>
      </div>
      <div className='col-sm-2'>
        <b>Current Balance</b>
      </div>
      <div className='col-sm-2'>
        <b>DR/CR</b>
      </div>
      <div className='col-sm-2'>
        <b>Amount</b>
      </div>
      <div className='col-sm-2'>
        <button onClick={addEntry} className='btn btn-outline-secondary w-100'>
          + Entry
        </button>
      </div>
    </div>
  );

  const entryGroup = transaction.entries.map((entry, index) => (
    <Entry
      key={index}
      index={index}
      accounts={accounts}
      entry={entry}
      entries={transaction.entries}
    />
  ));

  return (
    <>
      {transactionDetail}
      {header}
      {entryGroup}
    </>
  );
};

export default Transaction;
