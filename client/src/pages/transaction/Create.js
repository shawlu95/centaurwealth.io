import React from 'react';
import {
  createTransaction,
  resetTransaction,
} from '../../features/transaction/transactionSlice';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '../../components';
import { useDispatch } from 'react-redux';
const TransactionCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createTransaction()).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(resetTransaction());
        setTimeout(() => navigate(-1), 1000);
      }
    });
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

export default TransactionCreate;
