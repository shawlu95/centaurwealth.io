import React, { useState } from 'react';

const Budget = ({ budget, post, errors }) => {
  const isNew = budget === undefined;
  const [name, setName] = useState(isNew ? '' : budget.name);
  const [monthly, setMonthly] = useState(isNew ? 0 : budget.monthly);

  const onSubmit = async (e) => {
    e.preventDefault();
    await post({ name, monthly });
  };

  const createButton = <button className='btn btn-primary'>Create</button>;

  const updateButton = <button className='btn btn-primary'>Update</button>;

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className='d-grid gap-2'>
          <div className='form-group'>
            <label>Budget Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='form-control'
              disabled={budget && !budget.mutable}
            />
          </div>
          <div className='form-group'>
            <label>Monthly Budget</label>
            <input
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              className='form-control'
            />
          </div>
          {isNew ? createButton : updateButton}
          {errors}
        </div>
      </form>
    </div>
  );
};

export default Budget;
