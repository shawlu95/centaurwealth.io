import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import BudgetTotal from '../../components/budgetTotal';
import Expenses from '../../components/expenses';

const BudgetHistory = ({
  budgetId: initBudgetId,
  budgets: initBudgets,
  expenses: initExpenses,
  limit,
}) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState(initExpenses);
  const [budgets, setBudgets] = useState(initBudgets);
  const [budgetId, setBudgetId] = useState(initBudgetId);

  useEffect(() => {
    if (!loading) {
      fetchPage();
    }
  }, [page, budgetId]);

  const fetchPage = async () => {
    setLoading(true);
    const { data } = await axios.get('/api/budget', {
      params: { page, limit, budgetId },
    });
    setExpenses(data.expenses);
    setBudgets(data.budgets);
    setLoading(false);
  };

  const setBudgetFilter = async (budgetId) => {
    setBudgetId(budgetId);
  };

  const selectedBudget = budgets.filter((x) => x.id === budgetId)[0];

  return (
    <div className='container d-grid gap-2'>
      <h3>My Budget</h3>
      <div>
        <select
          name='budget'
          value={budgetId}
          className='form-control'
          onChange={(e) => setBudgetFilter(e.target.value)}
        >
          {budgets.map((budget) => (
            <option value={budget.id} key={budget.id}>
              {budget.name}
            </option>
          ))}
        </select>
      </div>
      <BudgetTotal budgets={[selectedBudget]} />
      <Expenses
        budgets={budgets}
        expenses={expenses}
        fetchPage={fetchPage}
        page={page}
        setPage={setPage}
      />
      <Link to={`/budget/update/${budgetId}`}>
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
