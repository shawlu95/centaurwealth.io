import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Account from '../../components/account';
import { clearAccount } from '../../features/account/accountSlice';

const AccountCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearAccount());
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className='container d-grid gap-2'>
          <Account />
          <button
            type='button'
            className='btn btn-secondary w-100'
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button className='btn btn-primary'>Create</button>;
        </div>
      </form>
    </div>
  );
};

export default AccountCreate;
