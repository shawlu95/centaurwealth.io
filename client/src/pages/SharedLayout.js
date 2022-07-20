import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components';
import Wrapper from '../assets/wrappers/SharedLayout';

const SharedLayout = () => {
  return (
    <Wrapper>
      <main className='full-page'>
        <Outlet />
      </main>
    </Wrapper>
  );
};

export default SharedLayout;
