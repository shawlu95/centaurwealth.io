import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';

const Signout = () => {
  const { doRequest } = useRequest({
    url: '/api/auth/signout',
    method: 'post',
    body: {},
    onSuccess: () => console.log('signout'),
  });

  useEffect(() => {
    doRequest();
  }, []);
  return (
    <div className='container d-grid gap-2'>
      <label>Signing out</label>
    </div>
  );
};

export default Signout;
