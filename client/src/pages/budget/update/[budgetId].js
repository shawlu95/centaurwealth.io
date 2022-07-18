import Budget from '../../../components/budget';
import Router from 'next/router';
import useRequest from '../../../hooks/use-request';

const BudgetEdit = ({ budget }) => {
  const { doRequest, errors } = useRequest({
    url: `/api/budget/${budget.id}`,
    method: 'patch',
    body: {},
    onSuccess: () => Router.push('/budget'),
  });

  return (
    <div>
      <h4>Update Budget</h4>
      <Budget budget={budget} post={doRequest} errors={errors} />
    </div>
  );
};

BudgetEdit.getInitialProps = async (context, axios) => {
  const { budgetId } = context.query;
  const res = await axios.get(`/api/budget/${budgetId}`);
  const budget = res.data.budget;

  return { budget };
};

export default BudgetEdit;
