import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketDetail = ({ account }) => {
  const [name, setName] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/account',
    method: 'patch',
    body: { id: account.id, name: name },
    onSuccess: () => Router.push('/'),
  });
  return (
    <div>
      <h1>{account.name}</h1>
      <h6>Debit: {account.debit}</h6>
      <h6>Credit: {account.credit}</h6>
      <h6>Balance: {account.balance}</h6>
      <div className='form-group'>
        <label>Update Title</label>
        <input
          className='form-control'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {errors}
      <button onClick={() => doRequest()} className='btn btn-primary'>
        Update
      </button>
    </div>
  );
};

TicketDetail.getInitialProps = async (context, axios) => {
  const { accountId } = context.query;
  const {
    data: { account },
  } = await axios.get(`/api/balance/${accountId}`);
  return { account };
};
export default TicketDetail;