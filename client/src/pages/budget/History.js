import { Link } from 'react-router-dom';

import React, { useEffect } from 'react';
import { BudgetTotal, Expenses } from '../../components';
import { useSelector, useDispatch } from 'react-redux';
import {
  getBudgetHistory,
  getBudgets,
  setBudget,
  setPage,
} from '../../features/budget/budgetSlice';
import { PageButtonContianer } from '../../components';

const BudgetHistory = () => {
  const dispatch = useDispatch();
  const { budget, budgets, expenses } = useSelector((store) => store.budget);
  const { page, totalPages } = expenses;

  useEffect(() => {
    dispatch(getBudgets());
  }, [expenses.docs.length]);

  useEffect(() => {
    dispatch(getBudgetHistory());
  }, [expenses.page, budget]);

  return (
    <div className='container d-grid gap-2'>
      <h3>My Budget</h3>
      <select
        name='budget'
        value={budget.id}
        className='form-control'
        onChange={(e) => {
          dispatch(setBudget({ budgetId: e.target.value }));
        }}
      >
        {budgets.map((budget) => (
          <option value={budget.id} key={budget.id}>
            {budget.name}
          </option>
        ))}
      </select>
      <BudgetTotal budgets={[budget]} />
      <Expenses />
      <PageButtonContianer
        totalPages={totalPages}
        page={page}
        setPage={setPage}
      />
      <Link to={`/budget/update`}>
        <button className='btn btn-primary w-100'>Update Budget</button>
      </Link>
    </div>
  );
};

export default BudgetHistory;
