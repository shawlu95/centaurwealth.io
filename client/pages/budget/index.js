import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
import { usdFormatter } from '../../utils';
import React, { useState, useEffect } from 'react';
import Budgets from '../../components/budgets';
import Expenses from '../../components/expenses';

// Not allowed to fetch data in component in server-side render
const BudgetIndex = ({
  budgets: initBudgets,
  expenses: initExpenses,
  currentUser,
  limit,
}) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState(initExpenses);
  const [budgets, setBudgets] = useState(initBudgets);
  const [budgetId, setBudgetId] = useState('');

  useEffect(() => {
    if (!loading) {
      fetchPage();
    }
  }, [page, budgetId]);

  const fetchPage = async () => {
    console.log('fetch page');
    setLoading(true);
    const params = { page, limit };
    if (budgetId) {
      params['budgetId'] = budgetId;
    }
    const { data } = await axios.get('/api/budget', {
      params,
    });
    setExpenses(data.expenses);
    setBudgets(data.budgets);
    setLoading(false);
  };

  const setBudgetFilter = async (budgetId) => {
    console.log('Apply filter', budgetId);
    setBudgetId(budgetId);
  };

  return (
    <div>
      <Budgets budgets={budgets} fetchPage={fetchPage} />
      <select
        name='budget'
        value={budgetId}
        onChange={(e) => setBudgetFilter(e.target.value)}
      >
        <option value='' key='all'>
          All
        </option>
        {budgets.map((budget) => (
          <option value={budget.id} key={budget.id}>
            {budget.name}
          </option>
        ))}
      </select>
      <Expenses
        budgets={budgets}
        expenses={expenses}
        fetchPage={fetchPage}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

BudgetIndex.getInitialProps = async (context, axios, currentUser) => {
  const limit = 25;
  const {
    data: { budgets, expenses },
  } = await axios.get('/api/budget', { params: { page: 1, limit } });

  return { budgets, expenses, limit, currentUser };
};

export default BudgetIndex;
