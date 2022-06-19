import Router from 'next/router';
import Transactions from '../../components/transactions';

// Not allowed to fetch data in component in server-side render
const TransactionsIndex = ({ transactions, url, limit }) => {
  return (
    <div>
      <h3>Transactions</h3>
      <button
        className='btn btn-primary'
        onClick={() => Router.push('/transactions/create')}
      >
        New Transaction
      </button>
      <Transactions transactions={transactions} url={url} limit={limit} />
    </div>
  );
};

TransactionsIndex.getInitialProps = async (context, axios, currentUser) => {
  const limit = 25;
  const url = '/api/transaction';
  const {
    data: { transactions },
  } = await axios.get(url, {
    params: { page: 1, limit },
  });
  return { transactions, url, limit };
};

export default TransactionsIndex;
