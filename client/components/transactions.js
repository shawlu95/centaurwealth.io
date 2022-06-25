import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usd } from '../utils';

const OFFSET = 5;

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
  const buttons = range(
    Math.max(page - OFFSET, 1),
    Math.min(page + OFFSET, totalPages)
  ).map((key) => (
    <button
      key={key}
      className={`btn btn-sm ${page == key ? 'btn-primary' : 'btn-light'}`}
      onClick={() => setPage(key)}
    >
      {key}
    </button>
  ));

  const transactionList = transactions.map((transaction) => {
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
          <Link
            href='/transaction/[transactionId]'
            as={`/transaction/${transaction.id}`}
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
            <th width='20%'>Date</th>
            <th width='40%'>Memo</th>
            <th width='20%'>Debit</th>
            <th width='20%'>Credit</th>
          </tr>
        </thead>
        <tbody>{transactionList}</tbody>
      </table>
      <div className='btn-container'>
        <button className='btn btn-light btn-sm' onClick={prevPage}>
          Prev
        </button>
        {buttons}
        <button className='btn btn-light btn-sm' onClick={nextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Transactions;
