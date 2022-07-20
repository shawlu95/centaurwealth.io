import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../../features/user/userSlice';
import { useDispatch } from 'react-redux';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    dispatch(signupUser({ email, password }));
    navigate('/', { replace: true });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='container d-grid gap-2'>
        <h3>Sign Up</h3>
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
        <button className='btn btn-primary'>Sign Up</button>
      </div>
    </form>
  );
};

export default Signup;
