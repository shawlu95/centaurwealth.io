import React from 'react';
import Entry from './entry';
import { addEntry } from '../features/transaction/transactionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { editTransaction } from '../features/transaction/transactionSlice';

const Transaction = () => {
  const dispatch = useDispatch();
  const { accounts } = useSelector((store) => store.account);
  const { transaction } = useSelector((store) => store.transaction);
  const isNew = transaction.id === undefined;

  const handleAddEntry = (e) => {
    e.preventDefault();
    let entry;
    if (transaction.entries.length >= 1) {
      entry = { ...transaction.entries[transaction.entries.length - 1] };
    } else {
      entry = {
        amount: '0',
        type: 'debit',
        accountName: accounts[0].name,
        accountId: accounts[0].id,
        accountType: accounts[0].type,
      };
    }
    dispatch(addEntry(entry));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(editTransaction({ name, value }));
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
          disabled={!isNew}
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
        <button
          onClick={handleAddEntry}
          className='btn btn-outline-secondary w-100'
        >
          + Entry
        </button>
      </div>
    </div>
  );

  const entryGroup = transaction.entries.map((entry, index) => (
    <Entry key={index} index={index} entry={entry} />
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
