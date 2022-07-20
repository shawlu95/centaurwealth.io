import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Transaction } from '../../components';
import { useDispatch } from 'react-redux';
import {
  getTransaction,
  deleteTransaction,
  updateTransaction,
  resetTransaction,
} from '../../features/transaction/transactionSlice';

const TransactionDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { transactionId } = useParams();

  useEffect(() => {
    dispatch(getTransaction(transactionId));
  }, [transactionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateTransaction()).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(resetTransaction());
        navigate(-1);
      }
    });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    dispatch(deleteTransaction(transactionId)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(resetTransaction());
        navigate(-1);
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='container d-grid gap-2'>
          <h4>Update Transaction</h4>
          <Transaction />
          <div className='row'>
            <div className='col-sm-12'>
              <button
                className='btn btn-primary w-100'
                style={{ marginRight: '15px' }}
              >
                Update
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
                onClick={() => {
                  dispatch(resetTransaction());
                  navigate(-1);
                }}
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
