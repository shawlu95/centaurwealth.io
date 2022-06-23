import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import Transactions from '../../components/transactions';
import { usd } from '../../utils';

const AccountEdit = ({ account, mutable, transactions, url, limit }) => {
  const [name, setName] = useState('');
  const { doRequest, errors } = useRequest({
    url: `/api/account/${account.id}`,
    method: 'patch',
    body: { id: account.id, name: name },
    onSuccess: () => Router.push('/'),
  });
  return (
    <div className='d-grid gap-2'>
      <h3>{account.name}</h3>
      <div className='row'>
        <h5>Balance: {usd.format(account.balance)}</h5>
        <div className='col-sm-4'>
          <input
            className='form-control'
            value={name}
            disabled={!mutable}
            placeholder={'Update Title'}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='col-sm-2'>
          <button
            onClick={() => doRequest()}
            className='btn btn-primary'
            disabled={!mutable}
          >
            Update
          </button>
        </div>
      </div>
      {errors}

      <Transactions transactions={transactions} url={url} limit={limit} />
    </div>
  );
};

AccountEdit.getInitialProps = async (context, axios) => {
  const { accountId } = context.query;
  const limit = 25;
  const {
    data: { account },
  } = await axios.get(`/api/balance/${accountId}`);

  const url = `/api/account/${accountId}`;
  const {
    data: {
      transactions,
      account: { mutable },
    },
  } = await axios.get(url, {
    params: { page: 1, limit },
  });

  return { account, mutable, transactions, url, limit };
};

export default AccountEdit;
