import Router from 'next/router';
import useRequest from '../hooks/use-request';
import React from 'react';
import { useForm, Form } from '../hooks/use-form';
import { useState } from 'react';
import Entry from './entry';

const Transaction = ({ transaction, accounts, closing }) => {
  const { values, handleInputChange } = useForm(transaction);
  const isNew = transaction.id === undefined;
  const [entries, setEntries] = useState(transaction.entries);

  const { doRequest: doUpsert, errors: upsertErrors } = useRequest({
    url: isNew ? '/api/transaction' : `/api/transaction/${transaction.id}`,
    method: isNew ? 'post' : 'put',
    body: { closing },
    onSuccess: () => Router.push('/transaction'),
  });

  const { doRequest: doDelete, errors: deleteErrors } = useRequest({
    url: `/api/transaction/${transaction.id}`,
    method: 'delete',
    body: {},
    onSuccess: () => Router.push('/transaction'),
  });

  const addEntry = (e) => {
    e.preventDefault();
    const updated = [...entries, entries[entries.length - 1]];
    setEntries(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    doUpsert({
      ...transaction,
      memo: values.memo,
      date: values.date,
      entries,
    });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    doDelete();
  };

  const transactionDetail = (
    <div className='row'>
      <div className='col-sm-9'>
        <b>Memo</b>
        <input
          className='form-control'
          name='memo'
          value={values.memo}
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
          value={values.date.split('T')[0]}
          onChange={handleInputChange}
        ></input>
      </div>
    </div>
  );

  const header = (
    <div className='row'>
      <div className='col-sm-6'>
        <b>Account</b>
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

  const entryGroup = entries.map((entry, index) => (
    <Entry
      key={index}
      index={index}
      accounts={accounts}
      entry={entry}
      entries={entries}
      setEntries={setEntries}
    />
  ));

  const upsertButton = (
    <div className='row'>
      <div className='col-sm-12'>
        <button
          onClick={handleSubmit}
          className='btn btn-primary w-100'
          style={{ marginRight: '15px' }}
        >
          {isNew ? 'Create Transaction' : 'Update Transaction'}
        </button>
      </div>
    </div>
  );

  const deleteButton = !isNew && (
    <div className='row'>
      <div className='col-sm-12'>
        <button onClick={handleDelete} className='btn btn-danger w-100'>
          Delete Transaction
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <h3>Transaction</h3>
      <Form>
        <div className='d-grid gap-2'>
          {transactionDetail}
          {header}
          {entryGroup}
          {upsertButton}
          {deleteButton}
        </div>
        {upsertErrors}
        {deleteErrors}
      </Form>
    </div>
  );
};

export default Transaction;
