import axios from 'axios';
import React from 'react';
import { Grid, Button } from '@mui/material';
import { useForm, Form } from '../../hooks/use-form';

export default function TransactionForm({ accounts, initValues }) {
  const { values, handleInputChange, resetForm } = useForm(initValues);

  const getAccount = (id) => accounts.filter((acc) => acc.id === id)[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credit = getAccount(values.creditAccountId);
    const debit = getAccount(values.debitAccountId);
    const body = {
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
    await axios.post('/api/transaction', body);
    resetForm();
  };

  return (
    <div>
      <h3>New Transaction</h3>
      <Form onSubmit={handleSubmit}>
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
              value={values.date}
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
              placeholder='debit'
              value={values.amount === 0 ? '' : values.amount}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={9}>
            <select
              className='form-control'
              name='creditAccountId'
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
            <button type='submit' className='btn btn-primary'>
              Update
            </button>
          </Grid>
        </Grid>
      </Form>
    </div>
  );
}

TransactionForm.getInitialProps = async (context, axios, currentUser) => {
  const { data } = await axios.get('/api/balance/current');

  const initValues = {
    memo: '',
    date: new Date().toISOString().split('T')[0],
    debitAccountId: data.accounts[0].id,
    creditAccountId: data.accounts[0].id,
    amount: 0,
  };

  return { accounts: data.accounts, initValues, currentUser };
};
