import Transaction from '../../../components/transaction';

const TransactionDetails = ({ accounts, transaction }) => {
  return (
    <div>
      <Transaction
        transaction={transaction}
        accounts={accounts}
        closing={true}
      />
    </div>
  );
};

TransactionDetails.getInitialProps = async (context, axios) => {
  const { accountId } = context.query;

  const {
    data: { accounts },
  } = await axios.get('/api/balance/current');

  const lte = new Date().toISOString();

  const res = await axios.get(`/api/account/close/${accountId}?lte=${lte}`);
  const transaction = res.data.transaction;

  return { accounts, transaction };
};

export default TransactionDetails;
