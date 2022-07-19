import React from 'react';
import Transaction from '../../components/transaction';

const TransactionCreate = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    // doUpsert({
    //   ...transaction,
    //   memo: values.memo,
    //   date: values.date,
    //   entries,
    // });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='container d-grid gap-2'>
          <h4>New Transaction</h4>
          <Transaction />
          <div className='row'>
            <div className='col-sm-12'>
              <button
                className='btn btn-primary w-100'
                style={{ marginRight: '15px' }}
              >
                Create
              </button>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-12'>
              <button
                type='button'
                className='btn btn-secondary w-100'
                onClick={() => console.log('back')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TransactionCreate;
