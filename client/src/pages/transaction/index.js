import Router from 'next/router';
import Transactions from '../../components/transactions';

// Not allowed to fetch data in component in server-side render
const TransactionIndex = ({ transactions, url, limit }) => {
  return (
    <div className='d-grid gap-2'>
      <h3>Transactions</h3>

      <Transactions transactions={transactions} url={url} limit={limit} />
      <button
        className='btn btn-primary w-100'
        onClick={() => Router.push('/transaction/create')}
      >
        New Transaction
      </button>
    </div>
  );
};

TransactionIndex.getInitialProps = async (context, axios, currentUser) => {
  const limit = 25;
  const url = '/api/transaction';
  const {
    data: { transactions },
  } = await axios.get(url, {
    params: { page: 1, limit },
  });
  return { transactions, url, limit };
};

export default TransactionIndex;
