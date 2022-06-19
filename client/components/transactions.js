import React from 'react';
import Link from 'next/link';

const Transactions = ({ transactions }) => {
  const transactionList = transactions.docs.map((transaction) => {
    return (
      <tr key={transaction.id}>
        <td>{transaction.date.split('T')[0]}</td>
        <td>{transaction.memo}</td>
        <td>{transaction.amount}</td>
        <td>
          <Link
            href='/transactions/[transactionId]'
            as={`/transactions/${transaction.id}`}
          >
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
            <th>Date</th>
            <th>Memo</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>{transactionList}</tbody>
      </table>
    </div>
  );
};

export default Transactions;
