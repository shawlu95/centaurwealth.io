import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signoutUser } from '../../features/user/userSlice';

const Signout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(signoutUser()).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/');
      }
    });
  }, []);

  return (
    <div className='container d-grid gap-2'>
      <label>Signing out</label>
    </div>
  );
};

export default Signout;
