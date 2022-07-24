import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Budgets, BudgetTotal } from '../../components';
import { useSelector, useDispatch } from 'react-redux';
import { getBudgets, resetBudget } from '../../features/budget/budgetSlice';

// Not allowed to fetch data in component in server-side render
const BudgetIndex = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBudgets());
  }, []);

  const { budgets } = useSelector((store) => store.budget);

  return (
    <div className='container d-grid gap-2'>
      <h3>My Budgets</h3>
      <BudgetTotal budgets={budgets} />
      <Budgets budgets={budgets} />
      <Link
        to='/budget/create'
        className='btn btn-primary w-100'
        onClick={() => dispatch(resetBudget())}
      >
        Create Budget
      </Link>
    </div>
  );
};

export default BudgetIndex;

import BudgetCreate from './Create';
import BudgetHistory from './History';
import BudgetUpdate from './Update';

export { BudgetCreate, BudgetHistory, BudgetUpdate };
