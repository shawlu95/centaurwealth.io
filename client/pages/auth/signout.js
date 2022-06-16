import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const Signout = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/auth/signin'),
  });

  useEffect(() => {
    doRequest();
  }, []);
  return <div>Signing out</div>;
};

export default Signout;
