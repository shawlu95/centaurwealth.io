import React from 'react';

import { Timeline, Cards } from '../components';

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
import ProtectedRoute from './ProtectedRoute';
import SharedLayout from './SharedLayout';

export { Error, Landing, ProtectedRoute, SharedLayout };
