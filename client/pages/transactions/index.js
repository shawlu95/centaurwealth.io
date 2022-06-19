import Link from 'next/link';
import Router from 'next/router';

// Not allowed to fetch data in component in server-side render
const LandingPage = ({ currentUser, transactions }) => {
  const transactionList = transactions.map((transaction) => {
    return (
      <tr key={transaction.id}>
        <td>{transaction.date.split('T')[0]}</td>
        <td>{transaction.memo}</td>
        <td>{transaction.amount}</td>
        <td>
          <Link
            href='/transactions/[transactionId]'
            as={`/transactions/${transaction.id}`}
          >
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });
  return (
    <div>
      <h3>Transactions</h3>
      <button
        className='btn btn-primary'
        onClick={() => Router.push('/transactions/create')}
      >
        New Transaction
      </button>
      <table className='table'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Memo</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>{transactionList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, axios, currentUser) => {
  const { data } = await axios.get('/api/transaction', {
    params: { page: 0, limit: 50 },
  });
  return { transactions: data.transactions, currentUser };
};

export default LandingPage;
