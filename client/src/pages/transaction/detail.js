import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Transaction from '../../components/transaction';
import { useSelector, useDispatch } from 'react-redux';
import {
  getTransaction,
  deleteTransaction,
} from '../../features/transaction/transactionSlice';

const TransactionDetail = () => {
  const navigate = useNavigate();
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
    dispatch(deleteTransaction(transactionId));
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
                Create
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
                onClick={() => navigate(-1)}
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
