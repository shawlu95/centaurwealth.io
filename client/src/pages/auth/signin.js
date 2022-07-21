import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signinUser, signinGoogle } from '../../features/user/userSlice';
import { useDispatch } from 'react-redux';

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignin = async ({ event, email, password }) => {
    event.preventDefault();
    dispatch(signinUser({ email, password })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/home', { replace: true });
      }
    });
  };

  return (
    <form className='page-100'>
      <div className='container d-grid gap-2'>
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
        <button
          className='btn btn-primary'
          onClick={(event) => handleSignin({ event, email, password })}
        >
          Sign In
        </button>
        <a className='btn btn-primary' href='/api/auth/google'>
          Use Google
        </a>
        <button
          className='btn btn-secondary'
          onClick={(event) => {
            handleSignin({
              event,
              email: 'test@centaurwealth.io',
              password: '1234',
            });
          }}
        >
          Demo Account
        </button>
      </div>
    </form>
  );
};

export default Signin;
