import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAccounts } from '../features/account/accountSlice';
import Card from './card';

const Cards = () => {
  const dispatch = useDispatch();
  const { summary } = useSelector((store) => store.account);
  const { user } = useSelector((store) => store.user);

  useEffect(() => {
    if (user) {
      dispatch(getAccounts());
    }
  }, [user]);

  const groups = Object.assign({}, ...summary.map((x) => ({ [x.type]: x })));
  return (
    groups && (
      <div className='d-grid gap-3'>
        <div className='row'>
          <div className='col-sm-6'>
            <Card {...groups['asset']} />
          </div>
          <div className='col-sm-6'>
            <Card {...groups['liability']} />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <Card {...groups['equity']} />
          </div>
          <div className='col-sm-6'>
            <Card {...groups['temporary']} />
          </div>
        </div>
      </div>
    )
  );
};

export default Cards;
