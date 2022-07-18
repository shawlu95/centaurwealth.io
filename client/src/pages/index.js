import React from 'react';

import Timeline from '../components/timeline';
import Cards from '../components/cards';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { summary } = useSelector((store) => store.account);
  return (
    <div className='container d-grid gap-2'>
      <Timeline />
      <Cards summary={summary} />
    </div>
  );
};

export default HomePage;
