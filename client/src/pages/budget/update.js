import Budget from '../../components/budget';
// import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const BudgetUpdate = ({ budget }) => {
  const { doRequest, errors } = useRequest({
    url: `/api/budget/${budget.id}`,
    method: 'patch',
    body: {},
    onSuccess: () => console.log("Router.push('/budget')"),
  });

  return (
    <div className='container d-grid gap-2'>
      <h4>Update Budget</h4>
      <Budget budget={budget} post={doRequest} errors={errors} />
    </div>
  );
};

// BudgetUpdate.getInitialProps = async (context, axios) => {
//   const { budgetId } = context.query;
//   const res = await axios.get(`/api/budget/${budgetId}`);
//   const budget = res.data.budget;

//   return { budget };
// };

export default BudgetUpdate;
