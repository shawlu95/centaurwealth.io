import React from 'react';
import { Link } from 'react-router-dom';
import { usd } from '../utils';
import { useSelector } from 'react-redux';

const Expenses = () => {
  const { expenses, budgets } = useSelector((store) => store.budget);

  const setBudgetId = async (e, expenseId) => {
    // await doClassify({ budgetId: e.target.value, expenseId });
  };

  const expenseList = expenses.docs.map((expense) => {
    return (
      <tr key={expense.id}>
        <td width='20%'>{expense.date.split('T')[0]}</td>
        <td width='40%'>{expense.memo}</td>
        <td width='20%'>{usd.format(expense.amount)}</td>
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
          <Link to={`/transaction/${expense.id}`}>View</Link>
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
    </div>
  );
};

export default Expenses;
