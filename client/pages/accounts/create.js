import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const CreateTicket = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('asset');
  const { doRequest, errors } = useRequest({
    url: '/api/account',
    method: 'post',
    body: {
      name,
      type,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <div>
      <h1>Create Account</h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label>Account Tittle</label>
          <input
            className='form-control'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Account Type</label>
          <select
            className='form-control'
            onChange={(e) => setType(e.target.value)}
          >
            <option value='asset'>Asset</option>
            <option value='liability'>Liability</option>
            <option value='equity'>Equity</option>
            <option value='temporary'>Temporary</option>
          </select>
        </div>
        {errors}
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
};

export default CreateTicket;
