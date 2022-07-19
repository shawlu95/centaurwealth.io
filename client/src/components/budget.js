import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { editBudget } from '../features/budget/budgetSlice';

const Budget = () => {
  const dispatch = useDispatch();
  const { budget } = useSelector((store) => store.budget);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(editBudget({ name, value }));
  };

  return (
    <>
      <div className='form-group'>
        <label>Budget Name</label>
        <input
          name='name'
          value={budget.name}
          onChange={handleChange}
          className='form-control'
          disabled={budget && !budget.mutable}
        />
      </div>
      <div className='form-group'>
        <label>Monthly Budget</label>
        <input
          name='monthly'
          value={budget.monthly}
          onChange={handleChange}
          className='form-control'
        />
      </div>
    </>
  );
};

export default Budget;
