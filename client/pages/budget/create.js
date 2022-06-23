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

  return <Budget post={doRequest} errors={errors} />;
};

export default BudgetCreate;
