import { Link } from 'react-router-dom';
import React from 'react';
import Budgets from '../../components/budgets';
import BudgetTotal from '../../components/budgetTotal';

// Not allowed to fetch data in component in server-side render
const BudgetIndex = ({ budgets }) => {
  return (
    <div className='d-grid gap-2'>
      <h3>My Budgets</h3>
      <Budgets budgets={budgets} />
      <BudgetTotal budgets={budgets} />
      <Link to='/budget/create'>
        <button className='btn btn-primary'>Create Budget</button>
      </Link>
    </div>
  );
};

BudgetIndex.getInitialProps = async (context, axios, currentUser) => {
  const limit = 25;
  const {
    data: { budgets, expenses },
  } = await axios.get('/api/budget', { params: { page: 1, limit } });

  return { budgets, expenses, limit };
};

export default BudgetIndex;
