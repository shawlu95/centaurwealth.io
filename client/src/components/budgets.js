import React from 'react';
import { Link } from 'react-router-dom';
import { usd } from '../utils';
import { useDispatch } from 'react-redux';
import { setBudget, setPage } from '../features/budget/budgetSlice';

const Budgets = ({ budgets }) => {
  const dispatch = useDispatch();
  return (
    <div>
      <table className='table'>
        <thead>
          <tr>
            <th width='40%'>Category</th>
            <th width='20%'>Month-to-Date</th>
            <th width='20%'>Quarter-to-Date</th>
            <th width='20%'>Year-to-Date</th>
          </tr>
        </thead>
        <tbody>
          {budgets
            .filter((budget) => budget.monthly > 0)
            .map((budget) => (
              <React.Fragment key={budget.id}>
                <tr>
                  <td width='40%'>
                    <Link
                      to={`/budget/history`}
                      onClick={() => {
                        dispatch(setPage({ page: 1 }));
                        dispatch(setBudget({ budgetId: budget.id }));
                      }}
                    >
                      <b>{budget.name}</b>
                    </Link>
                  </td>
                  <td width='20%' style={{ color: 'grey' }}>
                    {usd.format(budget.monthly)}
                  </td>
                  <td width='20%' style={{ color: 'grey' }}>
                    {usd.format(budget.quarterly)}
                  </td>
                  <td width='20%' style={{ color: 'grey' }}>
                    {usd.format(budget.annual)}
                  </td>
                </tr>
                <tr>
                  <td width='40%'></td>
                  <td width='20%'>
                    {usd.format(budget.summary.monthly?.amount || 0)}
                  </td>
                  <td width='20%'>
                    {usd.format(budget.summary.quarterly?.amount || 0)}
                  </td>
                  <td width='20%'>
                    {usd.format(budget.summary.annual?.amount || 0)}
                  </td>
                </tr>
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Budgets;
