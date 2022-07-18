import { useState } from 'react';
import useRequest from '../../hooks/use-request';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/auth/signin',
    method: 'post',
    body: { email, password },
    onSuccess: () => console.log('success'),
  });

  const signin = async (event) => {
    // Do not reload page
    event.preventDefault();
    await doRequest();
  };

  const signinDemo = async (event) => {
    event.preventDefault();
    await doRequest({
      email: 'test@centaurwealth.io',
      password: '1234',
    });
  };

  return (
    <form>
      <div className='container d-grid gap-2 '>
        <h3>Sign In</h3>
        <div className='form-group'>
          <label>Email Address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            className='form-control'
          />
        </div>
        {errors}
        <button className='btn btn-primary' onClick={signin}>
          Sign In
        </button>
        <button className='btn btn-secondary' onClick={signinDemo}>
          Demo Account
        </button>
      </div>
    </form>
  );
};

export default Signin;
