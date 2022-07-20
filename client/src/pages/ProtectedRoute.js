import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.user);
  console.log(user, children);
  if (!user) {
    return <Navigate to='/' />;
  }
  return children;
};

export default ProtectedRoute;
