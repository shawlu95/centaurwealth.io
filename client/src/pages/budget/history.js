import { Link } from 'react-router-dom';

import React, { useEffect } from 'react';
import BudgetTotal from '../../components/budgetTotal';
import Expenses from '../../components/expenses';
import { useSelector, useDispatch } from 'react-redux';
import {
  getBudgetHistory,
  setBudget,
  setPage,
} from '../../features/budget/budgetSlice';
import { PageButtonContianer } from '../../components';

const BudgetHistory = () => {
  const dispatch = useDispatch();
  const { budget, budgets, expenses } = useSelector((store) => store.budget);
  const { page, totalPages } = expenses;

  useEffect(() => {
    dispatch(getBudgetHistory());
  }, [expenses.page, budget]);

  return (
    <div className='container d-grid gap-2'>
      <h3>My Budget</h3>
      <div>
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
      </div>
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

BudgetHistory.getInitialProps = async (context, axios, currentUser) => {
  const limit = 25;
  const { budgetId } = context.query;
  const {
    data: { budgets, expenses },
  } = await axios.get('/api/budget', { params: { page: 1, limit, budgetId } });

  return { budgetId, budgets, expenses, limit };
};

export default BudgetHistory;
