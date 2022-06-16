import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketDetail = ({ transaction }) => {
  const [memo, setMemo] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/transaction',
    method: 'put',
    body: { id: transaction.id, memo },
    onSuccess: () => Router.push('/'),
  });
  return (
    <div>
      <h1>{transaction.memo}</h1>

      {errors}
      <button onClick={() => doRequest()} className='btn btn-primary'>
        Update
      </button>
    </div>
  );
};

TicketDetail.getInitialProps = async (context, axios) => {
  const { transactionId } = context.query;
  const {
    data: { transaction },
  } = await axios.get(`/api/transaction/${transactionId}`);
  return { transaction };
};

export default TicketDetail;
