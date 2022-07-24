import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Account } from '../../components';
import { updateAccount } from '../../features/account/accountSlice';

const AccountDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateAccount()).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate(-1);
      }
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className='container d-grid gap-2'>
          <Account />
          <button className='btn btn-primary'>Update</button>
          <button
            type='button'
            className='btn btn-secondary w-100'
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetail;
