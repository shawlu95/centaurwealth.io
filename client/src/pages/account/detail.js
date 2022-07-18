import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AccountDetail = () => {
  const navigate = useNavigate();
  const { account } = useSelector((store) => store.account);

  const isNew = account.id === undefined;

  const onSubmit = async (e) => {
    e.preventDefault();
  };

  const createButton = <button className='btn btn-primary'>Create</button>;

  const updateButton = <button className='btn btn-primary'>Update</button>;

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className='container d-grid gap-2'>
          <div className='form-group'>
            <label>Account Name</label>
            <input
              value={account.name}
              onChange={(e) => setName(e.target.value)}
              className='form-control'
              disabled={account && !account.mutable}
            />
          </div>
          <div className='form-group'>
            <label>Account Type</label>
            <select
              value={account.type}
              className='form-control'
              disabled={!isNew}
              onChange={(e) => setType(e.target.value)}
            >
              <option value='asset'>Asset</option>
              <option value='liability'>Liability</option>
              <option value='equity'>Equity</option>
              <option value='temporary'>Temporary</option>
            </select>
          </div>
          {isNew ? createButton : updateButton}
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
