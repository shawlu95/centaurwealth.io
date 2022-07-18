import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Account from '../../components/account';

const AccountDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { account } = useSelector((store) => store.account);

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
          <button className='btn btn-primary'>Update</button>;
        </div>
      </form>
    </div>
  );
};

export default AccountDetail;
