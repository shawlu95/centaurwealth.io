import Router from 'next/router';
import useRequest from '../hooks/use-request';
import React from 'react';
import { Grid } from '@mui/material';
import { useForm, Form } from '../hooks/use-form';

const Transaction = ({ transaction, accounts }) => {
  const { values, handleInputChange } = useForm(transaction);
  const isNew = transaction.id === undefined;
  const getAccount = (id) => accounts.filter((acc) => acc.id === id)[0];

  const { doRequest: doUpsert, errors: upsertErrors } = useRequest({
    url: '/api/transaction',
    method: isNew ? 'post' : 'put',
    body: {},
    onSuccess: () => Router.push('/transactions'),
  });

  const { doRequest: doDelete, errors: deleteErrors } = useRequest({
    url: `/api/transaction?id=${transaction.id}`,
    method: 'delete',
    body: {},
    onSuccess: () => Router.push('/transactions'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credit = getAccount(values.creditAccountId);
    const debit = getAccount(values.debitAccountId);
    const body = {
      ...transaction,
      memo: values.memo,
      date: values.date,
      entries: [
        {
          amount: values.amount,
          type: 'credit',
          accountName: credit.name,
          accountType: credit.type,
          accountId: credit.id,
        },
        {
          amount: values.amount,
          type: 'debit',
          accountName: debit.name,
          accountType: debit.type,
          accountId: debit.id,
        },
      ],
    };

    doUpsert(body);
  };

  const upsertButton = (
    <button onClick={handleSubmit} className='btn btn-primary'>
      {isNew ? 'Create' : 'Update'}
    </button>
  );

  const deleteButton = !isNew && (
    <button onClick={doDelete} className='btn btn-secondary'>
      Delete
    </button>
  );

  return (
    <div>
      <h3>Transaction</h3>
      <Form>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <label>Transaction Memo</label>
            <input
              className='form-control'
              name='memo'
              value={values.memo}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={3}>
            <label>Transaction Date</label>
            <input
              className='form-control'
              type='date'
              name='date'
              value={values.date.split('T')[0]}
              onChange={handleInputChange}
            ></input>
          </Grid>

          <Grid item xs={9}>
            <label>Account</label>
          </Grid>

          <Grid item xs={3}>
            <label>Amount</label>
          </Grid>

          <Grid item xs={9}>
            <select
              className='form-control'
              name='debitAccountId'
              value={values.debitAccountId}
              onChange={handleInputChange}
            >
              {accounts.map((account) => (
                <option value={account.id} key={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </Grid>

          <Grid item xs={3}>
            <input
              className='form-control'
              name='amount'
              value={values.amount === 0 ? '' : values.amount}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={9}>
            <select
              className='form-control'
              name='creditAccountId'
              value={values.creditAccountId}
              onChange={handleInputChange}
            >
              {accounts.map((account) => (
                <option value={account.id} key={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </Grid>
          <Grid item xs={8}>
            {upsertButton}
            {deleteButton}
            {upsertErrors}
            {deleteErrors}
          </Grid>
        </Grid>
      </Form>
    </div>
  );
};

export default Transaction;
