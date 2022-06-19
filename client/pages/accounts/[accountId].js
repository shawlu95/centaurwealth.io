import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import Transactions from '../../components/transactions';

const AccountDetails = ({ account, transactions, url, limit }) => {
  const [name, setName] = useState('');
  const { doRequest, errors } = useRequest({
    url: `/api/account/${account.id}`,
    method: 'patch',
    body: { id: account.id, name: name },
    onSuccess: () => Router.push('/'),
  });
  return (
    <div>
      <h3>{account.name}</h3>
      <h5>Balance: {account.balance}</h5>
      <div className='form-group'>
        <input
          className='form-control'
          value={name}
          placeholder={'Update Title'}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {errors}
      <button onClick={() => doRequest()} className='btn btn-primary'>
        Update
      </button>
      <Transactions transactions={transactions} url={url} limit={limit} />
    </div>
  );
};

AccountDetails.getInitialProps = async (context, axios) => {
  const { accountId } = context.query;
  const limit = 25;
  const {
    data: { account },
  } = await axios.get(`/api/balance/${accountId}`);

  const url = `/api/account/${accountId}`;
  const {
    data: { transactions },
  } = await axios.get(url, {
    params: { page: 1, limit },
  });

  return { account, transactions, url, limit };
};

export default AccountDetails;
