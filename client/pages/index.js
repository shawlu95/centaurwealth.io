import Link from 'next/link';
import Router from 'next/router';

// Not allowed to fetch data in component in server-side render
const LandingPage = ({ currentUser, accounts }) => {
  const accountList = accounts
    .filter((account) => account.balance != 0)
    .map((account) => {
      return (
        <tr key={account.id}>
          <td>{account.name}</td>
          <td>{account.type}</td>
          <td>{account.balance}</td>
          <td>
            <Link href='/accounts/[accountId]' as={`/accounts/${account.id}`}>
              <a>View</a>
            </Link>
          </td>
        </tr>
      );
    });
  return (
    <div>
      <h3>Balance Sheet</h3>
      <button
        className='btn btn-primary'
        onClick={() => Router.push('/accounts/create')}
      >
        New Account
      </button>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>{accountList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, axios, currentUser) => {
  const { data } = await axios.get('/api/balance/current');
  return { accounts: data.accounts, currentUser };
};

export default LandingPage;
