import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Budgets, BudgetTotal } from '../../components';
import { useSelector, useDispatch } from 'react-redux';

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
      <Budgets budgets={budgets} />
      <BudgetTotal budgets={budgets} />
      <Link to='/budget/create' className='btn btn-primary w-100'>
        Create Budget
      </Link>
    </div>
  );
};

export default BudgetIndex;

import BudgetCreate from './create';
import BudgetHistory from './history';
import BudgetUpdate from './update';
import { getBudgets } from '../../features/budget/budgetSlice';

export { BudgetCreate, BudgetHistory, BudgetUpdate };
