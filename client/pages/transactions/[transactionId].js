import Transaction from '../../components/transaction';

const TransactionEdit = ({ accounts, transaction }) => {
  return (
    <div>
      <Transaction transaction={transaction} accounts={accounts} />
    </div>
  );
};

TransactionEdit.getInitialProps = async (context, axios) => {
  const { transactionId } = context.query;

  const {
    data: { accounts },
  } = await axios.get('/api/balance/current');

  const res = await axios.get(`/api/transaction/${transactionId}`);
  const transaction = res.data.transaction;

  return { accounts, transaction };
};

export default TransactionEdit;
