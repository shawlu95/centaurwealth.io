import React from 'react';

import Timeline from '../components/timeline';
import Cards from '../components/cards';

const HomePage = () => {
  return (
    <div className='container d-grid gap-2'>
      <Timeline />
      <Cards />
    </div>
  );
};

export default HomePage;

import Error from './Error';
import Landing from './Landing';

export { Error, Landing };
