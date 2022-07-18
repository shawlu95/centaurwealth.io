import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usd } from '../../utils';
import { useSelector, useDispatch } from 'react-redux';
import { getAccounts, clearAccount } from '../../features/account/accountSlice';

// Not allowed to fetch data in component in server-side render
const AccountIndex = () => {
  const dispatch = useDispatch();
  const { accounts } = useSelector((store) => store.account);
  useEffect(() => {
    dispatch(getAccounts());
  }, []);

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
              <Link
                to={`/account/history/${account.id}`}
                className='btn btn-light btn-sm'
              >
                View
              </Link>
              {account.type === 'temporary' && (
                <Link
                  to={`/account/close/${account.id}`}
                  className='btn btn-light btn-sm'
                >
                  Close
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
    <div className='container d-grid gap-2'>
      <h3>Balance Sheet</h3>
      {asset}
      {liability}
      {equity}
      {temporary}

      <Link to='/account/detail'>
        <button className='btn btn-primary w-100' onClick={clearAccount}>
          New Account
        </button>
      </Link>
    </div>
  );
};

AccountIndex.getInitialProps = async (context, axios, currentUser) => {
  const { data } = await axios.get('/api/balance/current');
  return { accounts: data.accounts, currentUser };
};

export default AccountIndex;
