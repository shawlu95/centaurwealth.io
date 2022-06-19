import Router from 'next/router';
import Transactions from '../../components/transactions';

// Not allowed to fetch data in component in server-side render
const LandingPage = ({ transactions }) => {
  return (
    <div>
      <h3>Transactions</h3>
      <button
        className='btn btn-primary'
        onClick={() => Router.push('/transactions/create')}
      >
        New Transaction
      </button>
      <Transactions transactions={transactions} />
    </div>
  );
};

LandingPage.getInitialProps = async (context, axios, currentUser) => {
  const { data } = await axios.get('/api/transaction', {
    params: { page: 1, limit: 50 },
  });
  return { transactions: data.transactions };
};

export default LandingPage;
