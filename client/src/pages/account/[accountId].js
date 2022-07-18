import Link from 'next/link';
import Transactions from '../../components/transactions';
import { usd } from '../../utils';

const AccountEdit = ({ account, transactions, url, limit }) => {
  return (
    <div className='d-grid gap-2'>
      <div className='row'>
        <h4>{account.name}</h4>
        <b>Balance: {usd.format(account.balance)}</b>
      </div>

      <div className='row'>
        <Transactions transactions={transactions} url={url} limit={limit} />
      </div>

      <div className='row'>
        <Link
          href='/account/update/[accountId]'
          as={`/account/update/${account.id}`}
        >
          <button className='btn btn-primary w-100' disabled={!account.mutable}>
            Update Account
          </button>
        </Link>
      </div>

      <div className='row'>
        <Link href='/transaction/create'>
          <button className='btn btn-secondary w-100'>New Transaction</button>
        </Link>
      </div>
    </div>
  );
};

AccountEdit.getInitialProps = async (context, axios) => {
  const { accountId } = context.query;
  const limit = 25;
  const {
    data: { account },
  } = await axios.get(`/api/balance/${accountId}`);

  const url = `/api/account/${accountId}`;
  const {
    data: {
      transactions,
      account: { mutable },
    },
  } = await axios.get(url, {
    params: { page: 1, limit },
  });

  account.mutable = mutable;
  return { account, transactions, url, limit };
};

export default AccountEdit;
