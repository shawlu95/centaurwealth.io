import React from 'react';
import Link from 'next/link';
import { usdFormatter } from '../utils';

const Budgets = ({ budgets }) => {
  return (
    <div>
      <h4>My Budgets</h4>

      <Link href='/budget/create'>
        <button className='btn btn-primary'>Create Budget</button>
      </Link>
      <table className='table'>
        <thead>
          <tr>
            <th width='20%'>Category</th>
            <th width='10%'></th>
            <th width='20%'>Month</th>
            <th width='20%'>Quarter</th>
            <th width='20%'>Annual</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <React.Fragment key={budget.id}>
              <tr>
                <td width='20%'>
                  <b>{budget.name}</b>
                  <Link href='/budget/[budgetId]' as={`/budget/${budget.id}`}>
                    <button className='btn btn-light btn-sm'>Edit</button>
                  </Link>
                </td>
                <td width='20%'>Budget</td>
                <td width='20%'>{usdFormatter.format(budget.monthly)}</td>
                <td width='20%'>{usdFormatter.format(budget.quarterly)}</td>
                <td width='20%'>{usdFormatter.format(budget.annual)}</td>
              </tr>
              <tr>
                <td width='20%'></td>
                <td width='10%'>Spent</td>
                <td width='20%'>
                  {usdFormatter.format(budget.summary.monthly?.amount || 0)}
                </td>
                <td width='20%'>
                  {usdFormatter.format(budget.summary.quarterly?.amount || 0)}
                </td>
                <td width='20%'>
                  {usdFormatter.format(budget.summary.annual?.amount || 0)}
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
