import Link from 'next/link';
import Router from 'next/router';
import { usd } from '../../utils';

// Not allowed to fetch data in component in server-side render
const AccountIndex = ({ accounts }) => {
  const getSection = (type) => {
    var subtotal = 0;
    const body = accounts
      .filter((account) => account.type == type)
      .filter((account) => account.balance != 0)
      .map((account) => {
        subtotal += account.balance;
        return (
          <tr key={account.id}>
            <td width='40%'>{account.name}</td>
            <td width='40%'>{usd.format(account.balance)}</td>
            <td>
              <Link href='/account/[accountId]' as={`/account/${account.id}`}>
                <button className='btn btn-light btn-sm'>View</button>
              </Link>
              {account.type === 'temporary' && (
                <Link
                  href='/account/close/[accountId]'
                  as={`/account/close/${account.id}`}
                >
                  <button className='btn btn-light btn-sm'>Close</button>
                </Link>
              )}
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
        <tbody>
          {body}
          <tr>
            <td width='40%'>
              <b>Subtotal</b>
            </td>
            <td>{usd.format(subtotal)}</td>
          </tr>
        </tbody>
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
        onClick={() => Router.push('/account/create')}
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

AccountIndex.getInitialProps = async (context, axios, currentUser) => {
  const { data } = await axios.get('/api/balance/current');
  return { accounts: data.accounts, currentUser };
};

export default AccountIndex;
