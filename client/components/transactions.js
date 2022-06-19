import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Transactions = ({ transactions: { docs, totalPages }, url, limit }) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(docs);

  useEffect(() => {
    if (!loading) {
      fetchPage();
    }
  }, [page]);

  const fetchPage = async () => {
    setLoading(true);
    const {
      data: { transactions },
    } = await axios.get(url, {
      params: { page, limit },
    });
    setTransactions(transactions.docs);
    setLoading(false);
  };

  const nextPage = () => {
    setPage((oldPage) => {
      let nextPage = oldPage + 1;
      if (nextPage > totalPages) {
        nextPage = 1;
      }
      return nextPage;
    });
  };

  const prevPage = () => {
    setPage((oldPage) => {
      let nextPage = oldPage - 1;
      if (nextPage < 1) {
        nextPage = totalPages;
      }
      return nextPage;
    });
  };

  const range = (start, end) =>
    [...Array(end - start + 1)].map((_, i) => start + i);
  const buttons = range(1, totalPages).map((key) => (
    <button
      key={key}
      className={`page-btn ${page == key && 'btn-primary'}`}
      onClick={() => setPage(key)}
    >
      {key}
    </button>
  ));

  const transactionList = transactions.map((transaction) => {
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
      <div className='btn-container'>
        <button className='prev-btn' onClick={prevPage}>
          Prev
        </button>
        {buttons}
        <button className='prev-btn' onClick={nextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Transactions;
