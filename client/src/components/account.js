import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { handleChange } from '../features/account/accountSlice';

const Account = () => {
  const dispatch = useDispatch();
  const { account } = useSelector((store) => store.account);

  const isNew = account.id === undefined;

  const onChange = (e) => {
    const { name, value } = e.target;
    dispatch(handleChange({ name, value }));
  };

  return (
    <>
      <div className='form-group'>
        <label>Account Name</label>
        <input
          name='name'
          value={account.name}
          onChange={onChange}
          className='form-control'
          disabled={account && !account.mutable}
        />
      </div>
      <div className='form-group'>
        <label>Account Type</label>
        <select
          name='type'
          value={account.type}
          className='form-control'
          disabled={!isNew}
          onChange={onChange}
        >
          <option value='asset'>Asset</option>
          <option value='liability'>Liability</option>
          <option value='equity'>Equity</option>
          <option value='temporary'>Temporary</option>
        </select>
      </div>
    </>
  );
};

export default Account;
