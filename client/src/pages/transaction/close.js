import React, { useEffect } from 'react';
import { createTransaction } from '../../features/transaction/transactionSlice';
import { getClosingTransactionForAccount } from '../../features/transaction/transactionSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Transaction } from '../../components';
import { useDispatch } from 'react-redux';

const TransactionClose = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accountId } = useParams();

  useEffect(() => {
    const lte = new Date().toISOString();
    dispatch(getClosingTransactionForAccount({ accountId, lte }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createTransaction()).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate(-1);
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='container d-grid gap-2'>
          <h4>Closing Account</h4>
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

export default TransactionClose;
