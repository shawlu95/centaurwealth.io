import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const accountType = new Set(['asset', 'liability', 'equity', 'temporary']);

const CreateTicket = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/account',
    method: 'post',
    body: {
      name,
      type,
    },
    onSuccess: () => Router.push('/'),
  });

  // onBlur is triggered when user clicks away from first responder
  const onBlur = () => {
    if (!accountType.has(type)) {
      setType('');
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <div>
      <h1>Create Account</h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input
            className='form-control'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Type</label>
          <input
            className='form-control'
            value={type}
            onChange={(e) => setType(e.target.value)}
            onBlur={onBlur}
          />
        </div>
        {errors}
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
};

export default CreateTicket;
