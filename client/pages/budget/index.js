import Link from 'next/link';
import React from 'react';
import Budgets from '../../components/budgets';

// Not allowed to fetch data in component in server-side render
const BudgetIndex = ({ budgets }) => {
  return (
    <div>
      <h3>My Budgets</h3>
      <Link href='/budget/create'>
        <button className='btn btn-primary'>Create Budget</button>
      </Link>
      <Budgets budgets={budgets} />
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
