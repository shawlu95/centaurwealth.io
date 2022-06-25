import Link from 'next/link';
import Transactions from '../../components/transactions';
import { usd } from '../../utils';

const AccountEdit = ({ account, transactions, url, limit }) => {
  return (
    <div>
      <div className='row'>
        <h4>{account.name}</h4>
        <b>Balance: {usd.format(account.balance)}</b>
      </div>

      <Link
        href='/account/update/[accountId]'
        as={`/account/update/${account.id}`}
      >
        <button className='btn btn-primary' disabled={!account.mutable}>
          Update Account
        </button>
      </Link>

      <Transactions transactions={transactions} url={url} limit={limit} />
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
