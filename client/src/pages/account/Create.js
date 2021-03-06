import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Account } from '../../components';
import {
  resetAccount,
  createAccount,
} from '../../features/account/accountSlice';

const AccountCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetAccount());
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(createAccount()).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/account', { replace: true });
      }
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className='container d-grid gap-2'>
          <Account />
          <button className='btn btn-primary'>Create</button>
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

export default AccountCreate;
