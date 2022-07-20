import React from 'react';
import { useNavigate } from 'react-router-dom';
import Budget from '../../components/budget';
import { useDispatch } from 'react-redux';
import { updateBudget } from '../../features/budget/budgetSlice';

const BudgetUpdate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateBudget()).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate(-1);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='container d-grid gap-2'>
        <h4>Update Budget</h4>
        <Budget />
        <button className='btn btn-primary w-100'>Update</button>
        <button
          type='button'
          className='btn btn-secondary w-100'
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BudgetUpdate;
