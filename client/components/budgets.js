import React from 'react';
import Link from 'next/link';
import { usd } from '../utils';

const Budgets = ({ budgets }) => {
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
          {budgets.map((budget) => (
            <React.Fragment key={budget.id}>
              <tr>
                <td width='35%'>
                  <b>{budget.name}</b>
                  <Link
                    href='/budget/update/[budgetId]'
                    as={`/budget/update/${budget.id}`}
                  >
                    <button className='btn btn-light btn-sm'>Edit</button>
                  </Link>
                  <Link href='/budget/[budgetId]' as={`/budget/${budget.id}`}>
                    <button className='btn btn-light btn-sm'>View</button>
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
      <table className='table'>
        <thead>
          <tr>
            <th width='35%'>Total</th>
            <th width='15%'>Month</th>
            <th width='15%'>Quarter</th>
            <th width='15%'>Annual</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td width='35%'>
              <b>Budget</b>
            </td>
            <td width='15%'>
              {usd.format(budgets.reduce((s, x) => x.monthly + s, 0))}
            </td>
            <td width='15%'>
              {usd.format(budgets.reduce((s, x) => x.quarterly + s, 0))}
            </td>
            <td width='15%'>
              {usd.format(budgets.reduce((s, x) => x.annual + s, 0))}
            </td>
          </tr>
          <tr>
            <td width='35%'>
              <b>Expense</b>
            </td>
            <td width='15%'>
              {usd.format(
                budgets
                  .filter((x) => x.summary.monthly?.amount > 0)
                  .reduce((s, x) => x.summary.monthly.amount + s, 0)
              )}
            </td>
            <td width='15%'>
              {usd.format(
                budgets
                  .filter((x) => x.summary.quarterly?.amount > 0)
                  .reduce((s, x) => x.summary.quarterly.amount + s, 0)
              )}
            </td>
            <td width='15%'>
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

export default Budgets;
