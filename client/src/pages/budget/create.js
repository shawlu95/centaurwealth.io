import React from 'react';
import Router from 'next/router';
import Budget from '../../components/budget';
import useRequest from '../../hooks/use-request';

const BudgetCreate = () => {
  const { doRequest, errors } = useRequest({
    url: `/api/budget`,
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/budget'),
  });

  return (
    <div>
      <h4>New Budget</h4>
      <Budget post={doRequest} errors={errors} />
    </div>
  );
};

export default BudgetCreate;
