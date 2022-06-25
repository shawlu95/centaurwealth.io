import { capitalize } from '@mui/material';
import { usd } from '../utils';

const data = {
  asset: {
    intro:
      'An asset is any resource owned or controlled by a business or an economic entity. Assets represent value of ownership that can be converted into cash.',
    link: 'https://en.wikipedia.org/wiki/Asset',
  },

  liability: {
    intro:
      'A liability is defined as the future sacrifices of economic benefits that the entity is obliged to make to other entities as a result of past transactions or other past event.',
    link: 'https://en.wikipedia.org/wiki/Liability_(financial_accounting)',
  },
  equity: {
    intro:
      'Equity is ownership of assets that may have debts or other liabilities attached to them. Equity is measured for accounting purposes by subtracting liabilities from the value of the assets',
    link: 'https://en.wikipedia.org/wiki/Equity_(finance)',
  },
  temporary: {
    intro:
      'A general ledger account that begins each accounting year with a zero balance. Then at the end of the year its account balance is removed by transferring the amount to another account.',
    link: 'https://www.accountingcoach.com/blog/what-is-a-temporary-account',
  },
};

const Card = ({ type, balance, count }) => {
  return (
    <div className='card'>
      <div className='card-body'>
        <h5
          data-toggle='tooltip'
          className='card-title'
          title={data[type].intro}
        >
          {capitalize(type)}
        </h5>
        <h6 className='card-subtitle mb-2 text-muted'>
          Balance: {usd.format(balance)} | {count} Accounts
        </h6>
      </div>
    </div>
  );
};

export default Card;
