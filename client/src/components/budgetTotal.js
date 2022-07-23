import React from 'react';
import { usd } from '../utils';

const BudgetTotal = ({ budgets }) => {
  return (
    <div>
      <table className='table'>
        <thead>
          <tr>
            <th width='25%'>Total</th>
            <th width='25%'>Month-to-Date</th>
            <th width='25%'>Quarter-to-Date</th>
            <th width='25%'>Year-to-Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td width='25%'>
              <b>Expense / Budget</b>
            </td>
            <td width='25%'>
              {usd.format(
                budgets
                  .filter((x) => x.summary.monthly?.amount > 0)
                  .reduce((s, x) => x.summary.monthly.amount + s, 0)
              )}
              {' / '}
              {usd.format(budgets.reduce((s, x) => x.monthly + s, 0))}
            </td>
            <td width='25%'>
              {usd.format(
                budgets
                  .filter((x) => x.summary.quarterly?.amount > 0)
                  .reduce((s, x) => x.summary.quarterly.amount + s, 0)
              )}
              {' / '}
              {usd.format(budgets.reduce((s, x) => x.quarterly + s, 0))}
            </td>
            <td width='25%'>
              {usd.format(
                budgets
                  .filter((x) => x.summary.annual?.amount > 0)
                  .reduce((s, x) => x.summary.annual.amount + s, 0)
              )}
              {' / '}
              {usd.format(budgets.reduce((s, x) => x.annual + s, 0))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BudgetTotal;
