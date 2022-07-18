import React from 'react';
import { Link } from 'react-router-dom';
import { usd } from '../utils';
import { useSelector } from 'react-redux';

const Transactions = () => {
  const {
    transactions: { docs },
  } = useSelector((store) => store.account);

  const transactionList = docs.map((transaction) => {
    var debit = transaction.debit;
    var credit = transaction.credit;
    if (!debit && !credit) {
      debit = transaction.amount;
      credit = transaction.amount;
    }
    return (
      <tr key={transaction.id}>
        <td width='20%'>{transaction.date.split('T')[0]}</td>
        <td width='40%'>{transaction.memo}</td>
        <td width='20%'>{usd.format(debit)}</td>
        <td width='20%'>{usd.format(credit)}</td>
        <td>
          <Link to={`/transaction/${transaction.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <table className='table'>
        <thead>
          <tr>
            <th width='20%'>Date</th>
            <th width='40%'>Memo</th>
            <th width='20%'>Debit</th>
            <th width='20%'>Credit</th>
          </tr>
        </thead>
        <tbody>{transactionList}</tbody>
      </table>
    </div>
  );
};

export default Transactions;
