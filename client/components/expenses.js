import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useRequest from '../hooks/use-request';
import Link from 'next/link';
import { usdFormatter } from '../utils';

const OFFSET = 5;
const LIMIT = 25;

const Expenses = ({
  expenses: { docs, totalPages },
  budgets,
  page,
  setPage,
  fetchPage,
}) => {
  const { doRequest: doClassify, errors: classifyErrors } = useRequest({
    url: '/api/budget/classify',
    method: 'post',
    body: {},
    onSuccess: () => console.log('classified expense'),
  });

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

  const setBudgetId = async (e, expenseId) => {
    await doClassify({ budgetId: e.target.value, expenseId });
    await fetchPage();
  };

  const range = (start, end) =>
    [...Array(end - start + 1)].map((_, i) => start + i);

  const buttons = range(
    Math.max(page - OFFSET, 1),
    Math.min(page + OFFSET, totalPages)
  ).map((key) => (
    <button
      key={key}
      className={`page-btn ${page == key && 'btn-primary'}`}
      onClick={() => setPage(key)}
    >
      {key}
    </button>
  ));

  const expenseList = docs.map((expense) => {
    return (
      <tr key={expense.id}>
        <td width='20%'>{expense.date.split('T')[0]}</td>
        <td width='40%'>{expense.memo}</td>
        <td width='20%'>{usdFormatter.format(expense.amount)}</td>
        <td width='20%'>
          <select
            name='budgetId'
            value={expense.budgetId}
            onChange={(e) => setBudgetId(e, expense.id)}
          >
            {budgets.map((budget) => (
              <option value={budget.id} key={budget.id}>
                {budget.name}
              </option>
            ))}
          </select>
        </td>
        <td>
          <Link
            href='/transactions/[transactionId]'
            as={`/transactions/${expense.id}`}
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
            <th width='20%'>Amount</th>
            <th width='20%'>Category</th>
          </tr>
        </thead>
        <tbody>{expenseList}</tbody>
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

export default Expenses;
