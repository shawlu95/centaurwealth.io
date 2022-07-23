import React from 'react';
import { usd } from '../utils';

const BudgetTotal = ({ budgets }) => {
  return (
    <div>
      <table className='table'>
        <thead>
          <tr>
            <th width='40%'>Total</th>
            <th width='20%'>Month</th>
            <th width='20%'>Quarter</th>
            <th width='20%'>Annual</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td width='40%'>
              <b>Budget</b>
            </td>
            <td width='20%' style={{ color: 'grey' }}>
              {usd.format(budgets.reduce((s, x) => x.monthly + s, 0))}
            </td>
            <td width='20%' style={{ color: 'grey' }}>
              {usd.format(budgets.reduce((s, x) => x.quarterly + s, 0))}
            </td>
            <td width='20%' style={{ color: 'grey' }}>
              {usd.format(budgets.reduce((s, x) => x.annual + s, 0))}
            </td>
          </tr>
          <tr>
            <td width='40%'>
              <b>Expense</b>
            </td>
            <td width='20%'>
              {usd.format(
                budgets
                  .filter((x) => x.summary.monthly?.amount > 0)
                  .reduce((s, x) => x.summary.monthly.amount + s, 0)
              )}
            </td>
            <td width='20%'>
              {usd.format(
                budgets
                  .filter((x) => x.summary.quarterly?.amount > 0)
                  .reduce((s, x) => x.summary.quarterly.amount + s, 0)
              )}
            </td>
            <td width='20%'>
              {usd.format(
                budgets
                  .filter((x) => x.summary.annual?.amount > 0)
                  .reduce((s, x) => x.summary.annual.amount + s, 0)
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BudgetTotal;
