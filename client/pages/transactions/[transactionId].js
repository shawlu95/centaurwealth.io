import Transaction from '../../components/transaction';

const TransactionDetails = ({ accounts, transaction }) => {
  return (
    <div>
      <Transaction transaction={transaction} accounts={accounts} />
    </div>
  );
};

TransactionDetails.getInitialProps = async (context, axios) => {
  const { transactionId } = context.query;

  const {
    data: { accounts },
  } = await axios.get('/api/balance/current');

  var transaction = {
    memo: '',
    date: new Date().toISOString(),
    entries: [],
  };

  try {
    const res = await axios.get(`/api/transaction/${transactionId}`);
    transaction = res.data.transaction;
  } catch (err) {
    //TODO: this getInitialProps is triggered when transaction is deleted
    // for now, server redirects to /transactions page
    // try not to trigger the reload
    context.res.writeHead(302, { Location: '/transactions' });
    context.res.end();
  }

  return { accounts, transaction };
};

export default TransactionDetails;
