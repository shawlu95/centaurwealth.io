import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import Account from '../../components/account';

const AccountCreate = () => {
  const { doRequest, errors } = useRequest({
    url: '/api/account',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/account'),
  });

  return (
    <div>
      <h4>New Account</h4>
      <Account post={doRequest} errors={errors} />
    </div>
  );
};

export default AccountCreate;
