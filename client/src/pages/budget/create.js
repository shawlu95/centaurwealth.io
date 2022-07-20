import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Budget } from '../../components';
import { useDispatch } from 'react-redux';
import { createBudget } from '../../features/budget/budgetSlice';

const BudgetCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createBudget()).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate(-1);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='container d-grid gap-2'>
        <h4>New Budget</h4>
        <Budget />
        <button className='btn btn-primary w-100'>Create</button>
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

export default BudgetCreate;
