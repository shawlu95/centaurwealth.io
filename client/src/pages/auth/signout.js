import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const Signout = () => {
  const { doRequest } = useRequest({
    url: '/api/auth/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/auth/signin'),
  });

  useEffect(() => {
    doRequest();
  }, []);
  return (
    <div className='d-grid gap-2'>
      <label>Signing out</label>
    </div>
  );
};

export default Signout;
