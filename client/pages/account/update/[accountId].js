import Router from 'next/router';
import useRequest from '../../../hooks/use-request';
import Account from '../../../components/account';

const AccountDetails = ({ account }) => {
  const { doRequest, errors } = useRequest({
    url: `/api/account/${account.id}`,
    method: 'patch',
    body: { id: account.id },
    onSuccess: () => Router.push(`/account/${account.id}`),
  });

  return (
    <div>
      <h4>Update Account</h4>
      <Account account={account} post={doRequest} errors={errors} />
    </div>
  );
};

AccountDetails.getInitialProps = async (context, axios) => {
  const { accountId } = context.query;

  const url = `/api/account/${accountId}`;
  const {
    data: { account },
  } = await axios.get(url, {
    params: { page: 1, limit: 10 },
  });

  return { account };
};

export default AccountDetails;
