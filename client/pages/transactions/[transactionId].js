import Transaction from '../../components/transaction';

const TicketDetail = ({ accounts, transaction }) => {
  return (
    <div>
      <Transaction transaction={transaction} accounts={accounts} />
    </div>
  );
};

TicketDetail.getInitialProps = async (context, axios) => {
  const { transactionId } = context.query;

  const {
    data: { accounts },
  } = await axios.get('/api/balance/current');

  var transaction = {
    memo: '',
    date: new Date().toISOString(),
    debitAccountId: accounts[0].id,
    creditAccountId: accounts[0].id,
    amount: 0,
  };

  try {
    const res = await axios.get(`/api/transaction/${transactionId}`);
    transaction = res.data.transaction;
    transaction.debitAccountId = transaction.entries.filter(
      (e) => e.type == 'debit'
    )[0].accountId;

    transaction.creditAccountId = transaction.entries.filter(
      (e) => e.type == 'credit'
    )[0].accountId;
  } catch (err) {
    //TODO: this getInitialProps is triggered when transaction is deleted
    // for now, server redirects to /transactions page
    // try not to trigger the reload
    context.res.writeHead(302, { Location: '/transactions' });
    context.res.end();
  }

  return { accounts, transaction };
};

export default TicketDetail;
