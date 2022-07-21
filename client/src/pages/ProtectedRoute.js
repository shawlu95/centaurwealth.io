import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from '../features/user/userSlice';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, []);

  const { user } = useSelector((store) => store.user);
  if (!user) {
    return <Navigate to='/' />;
  }

  return children;
};

export default ProtectedRoute;
