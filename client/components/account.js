import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Account = ({ account, post, errors }) => {
  const isNew = account === undefined;
  const [name, setName] = useState(isNew ? '' : account.name);
  const [type, setType] = useState('asset');
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    await post({ name, type });
  };

  const createButton = <button className='btn btn-primary'>Create</button>;

  const updateButton = <button className='btn btn-primary'>Update</button>;

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className='d-grid gap-2'>
          <div className='form-group'>
            <label>Account Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='form-control'
              disabled={account && !account.mutable}
            />
          </div>
          <div className='form-group'>
            <label>Account Type</label>
            <select
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
            onClick={() => router.back()}
          >
            Cancel
          </button>
          {errors}
        </div>
      </form>
    </div>
  );
};

export default Account;
