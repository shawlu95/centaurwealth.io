import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/context';

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signin } = useAppContext();

  const handleSignin = async ({ event, email, password }) => {
    // Do not reload page
    event.preventDefault();
    signin({ email, password });
    navigate('/', { replace: true });
  };

  return (
    <form>
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
