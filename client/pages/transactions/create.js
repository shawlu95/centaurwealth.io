import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Snackbar,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import InputAdornment from '@mui/material/InputAdornment';
import { useForm, Form } from '../../hooks/use-form';
import { useRequest } from '../../hooks/use-request';
import DatePicker from '../../components/DatePicker';
import {
  getDaysDiff,
  toTransactionDate,
  getTransactionDate,
} from '../../utils/formatTime';
import { DECIMAL } from '../../utils/formatNumber';

function formatEntriesForChain(values) {
  const amount = Math.round(values.amount * 100) * 10 ** (DECIMAL - 2);
  const entries = [];
  entries.push([0, values.debitAccountId, 0, amount]);
  entries.push([0, values.creditAccountId, 1, amount]);
  return entries;
}

function formatEntriesForNode(values) {
  const amount = Math.round(values.amount * 100) * 10 ** (DECIMAL - 2);
  const entries = [
    {
      amount,
      accountId: values.debitAccountId, // [, values.creditAccountId],
      actions: [0, 1],
      amounts: [amount, amount],
    },
  ];
  return entries;
}

const initValues = {
  id: 0,
  memo: '',
  debitAccountId: 1,
  creditAccountId: 1,
  date: new Date(),
  amount: 0,
};

export default function TransactionForm(props) {
  const { recordForEdit, accounts, accountsMap, initValues, entryMap } = props;
  const validate = () => true;

  // const { doRequest, errors } = useRequest({
  //   url: '/api/transaction',
  //   method: recordForEdit != null ? 'put' : 'post',
  //   body: {
  //     orderId: order.id,
  //   },
  //   onSuccess: () => Router.push('/'),
  // });

  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showAddTransactionSuccess, setShowAddTransactionSuccess] =
    useState(false);
  const [showUpdateTransactionSuccess, setShowUpdateTransactionSuccess] =
    useState(false);

  console.log('initValues', initValues);
  const { values, setValues, handleInputChange, resetForm } =
    useForm(initValues);

  const handleSubmit = async (e) => {
    if (validate()) {
      setShowBackdrop(true);
      const credit = accountsMap[values.creditAccountId];
      const debit = accountsMap[values.debitAccountId];
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
      console.log(body);
      const res = await axios.post('/api/transaction', body);
    }
    e.preventDefault();
  };

  useEffect(() => {
    console.log(recordForEdit);
    if (recordForEdit != null) {
      let debitAccountId = -1;
      let creditAccountId = -1;
      recordForEdit.entries.forEach((id) => {
        const entry = entryMap[id];
        if (entry.action === 0) {
          debitAccountId = entry.ledgerAccountId;
        } else if (entry.action === 1) {
          creditAccountId = entry.ledgerAccountId;
        }
      });

      setValues({
        id: recordForEdit.id,
        memo: recordForEdit.memo,
        debitAccountId: debitAccountId,
        creditAccountId: creditAccountId,
        date: getTransactionDate(recordForEdit.date),
        amount: recordForEdit.amount,
      });
    }
  }, [recordForEdit]);

  const handleCloseSnack = () => {
    setShowAddTransactionSuccess(false);
    setShowUpdateTransactionSuccess(false);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant='standard'
              label='Transaction Memo'
              name='memo'
              value={values.memo}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={6}>
            <DatePicker values={values} onChange={handleInputChange} />
          </Grid>

          <Grid item xs={6}>
            <TextField
              variant='standard'
              label='Amount'
              name='amount'
              value={values.amount === 0 ? '' : values.amount}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>$</InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl>
              <InputLabel>Debit Account</InputLabel>
              <Select
                name='debitAccountId'
                label='Debit Account ID'
                variant='standard'
                value={values.debitAccountId}
                onChange={handleInputChange}
              >
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl>
              <InputLabel>Credit Account</InputLabel>
              <Select
                name='creditAccountId'
                label='Credit Account ID'
                variant='standard'
                value={values.creditAccountId}
                onChange={handleInputChange}
              >
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={8}>
            <div>
              <Button type='submit'>Submit</Button>
            </div>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={showBackdrop}
            >
              <CircularProgress color='success' />
            </Backdrop>
            <Snackbar
              open={showAddTransactionSuccess}
              autoHideDuration={1000}
              onClose={handleCloseSnack}
              message='Added transaction record.'
            />
            <Snackbar
              open={showUpdateTransactionSuccess}
              autoHideDuration={1000}
              onClose={handleCloseSnack}
              message='Updated transaction record.'
            />
          </Grid>
        </Grid>
      </Form>
    </div>
  );
}

TransactionForm.getInitialProps = async (context, axios, currentUser) => {
  const { data } = await axios.get('/api/balance/current');
  const accountsMap = {};
  data.accounts.forEach((account) => (accountsMap[account.id] = account));

  const initValues = {
    id: 0,
    memo: '',
    debitAccountId: data.accounts[0].id,
    creditAccountId: data.accounts[0].id,
    date: new Date(),
    amount: 0,
  };

  console.log(initValues);

  return { accounts: data.accounts, initValues, accountsMap, currentUser };
};
