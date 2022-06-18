import Link from 'next/link';
import Router from 'next/router';

// Not allowed to fetch data in component in server-side render
const AccountsPage = ({ currentUser, accounts }) => {
  const getSection = (type) => {
    const body = accounts
      .filter((account) => account.type == type)
      .filter((account) => account.balance > 0)
      .map((account) => {
        return (
          <tr key={account.id}>
            <td width='40%'>{account.name}</td>
            <td width='40%'>{account.balance}</td>
            <td>
              <Link href='/accounts/[accountId]' as={`/accounts/${account.id}`}>
                <a>View</a>
              </Link>
            </td>
          </tr>
        );
      });

    return (
      <table className='table'>
        <thead>
          <tr>
            <th width='40%'>{type.toUpperCase()}</th>
            <th width='40%'>Balance</th>
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    );
  };

  const asset = getSection('asset');
  const liability = getSection('liability');
  const equity = getSection('equity');
  const temporary = getSection('temporary');
  return (
    <div>
      <h3>Balance Sheet</h3>
      <button
        className='btn btn-primary'
        onClick={() => Router.push('/accounts/create')}
      >
        New Account
      </button>
      {asset}
      {liability}
      {equity}
      {temporary}
    </div>
  );
};

AccountsPage.getInitialProps = async (context, axios, currentUser) => {
  const { data } = await axios.get('/api/balance/current');
  return { accounts: data.accounts, currentUser };
};

export default AccountsPage;
