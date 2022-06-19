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
    data: { transaction },
  } = await axios.get(`/api/transaction/${transactionId}`);

  transaction.debitAccountId = transaction.entries.filter(
    (e) => e.type == 'debit'
  )[0].accountId;

  transaction.creditAccountId = transaction.entries.filter(
    (e) => e.type == 'credit'
  )[0].accountId;

  const {
    data: { accounts },
  } = await axios.get('/api/balance/current');

  return { accounts, transaction };
};

export default TicketDetail;
