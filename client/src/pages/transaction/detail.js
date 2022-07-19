import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Transaction from '../../components/transaction';
import { useSelector, useDispatch } from 'react-redux';
import { getTransaction } from '../../features/transaction/transactionSlice';

const TransactionDetail = () => {
  const dispatch = useDispatch();
  const { accounts } = useSelector((store) => store.account);
  const { transaction } = useSelector((store) => store.transaction);
  const isNew = transaction.id === undefined;
  const { transactionId } = useParams();

  useEffect(() => {
    dispatch(getTransaction(transactionId));
  }, [transactionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // doUpsert({
    //   ...transaction,
    //   memo: values.memo,
    //   date: values.date,
    //   entries,
    // });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    // doDelete();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='container d-grid gap-2'>
          <h4>Update Transaction</h4>
          <Transaction transaction={transaction} accounts={accounts} />
          <div className='row'>
            <div className='col-sm-12'>
              <button
                className='btn btn-primary w-100'
                style={{ marginRight: '15px' }}
              >
                {isNew ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-12'>
              <button
                type='button'
                onClick={handleDelete}
                className='btn btn-danger w-100'
              >
                Delete
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

export default TransactionDetail;
