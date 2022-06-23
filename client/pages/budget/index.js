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

  useEffect(() => {
    if (!loading) {
      fetchPage();
    }
  }, [page]);

  const fetchPage = async () => {
    console.log('fetch page');
    setLoading(true);
    const { data } = await axios.get('/api/budget', {
      params: { page, limit },
    });
    setExpenses(data.expenses);
    setBudgets(data.budgets);
    setLoading(false);
  };

  return (
    <div>
      <Budgets budgets={budgets} fetchPage={fetchPage} />
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
