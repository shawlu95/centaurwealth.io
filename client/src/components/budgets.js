import React from 'react';
import { Link } from 'react-router-dom';
import { usd } from '../utils';
import { useDispatch } from 'react-redux';
import { setBudget } from '../features/budget/budgetSlice';

const Budgets = ({ budgets }) => {
  const dispatch = useDispatch();
  return (
    <div>
      <table className='table'>
        <thead>
          <tr>
            <th width='35%'>Category</th>
            <th width='15%'>Month</th>
            <th width='15%'>Quarter</th>
            <th width='15%'>Annual</th>
          </tr>
        </thead>
        <tbody>
          {budgets
            .filter((budget) => budget.monthly > 0)
            .map((budget) => (
              <React.Fragment key={budget.id}>
                <tr>
                  <td width='35%'>
                    <b>{budget.name}</b>
                    <Link
                      to={`/budget/update`}
                      className='btn btn-light btn-sm'
                      onClick={() =>
                        dispatch(setBudget({ budgetId: budget.id }))
                      }
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/budget/history`}
                      className='btn btn-light btn-sm'
                      onClick={() =>
                        dispatch(setBudget({ budgetId: budget.id }))
                      }
                    >
                      View
                    </Link>
                  </td>
                  <td width='15%'>{usd.format(budget.monthly)}</td>
                  <td width='15%'>{usd.format(budget.quarterly)}</td>
                  <td width='15%'>{usd.format(budget.annual)}</td>
                </tr>
                <tr>
                  <td width='35%'></td>
                  <td width='15%'>
                    {usd.format(budget.summary.monthly?.amount || 0)}
                  </td>
                  <td width='15%'>
                    {usd.format(budget.summary.quarterly?.amount || 0)}
                  </td>
                  <td width='15%'>
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
