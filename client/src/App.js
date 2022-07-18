import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages';
import { Signin, Signup, Signout } from './pages/auth';
import Account from './pages/account';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountHistory from './pages/account/history';
import AccountDetail from './pages/account/detail';
function App() {
  const { user } = useSelector((store) => store.user);
  return (
    <Router>
      <Header currentUser={user} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth/signin' element={<Signin />} />
        <Route path='/auth/signup' element={<Signup />} />
        <Route path='/auth/signout' element={<Signout />} />
        <Route path='/account' element={<Account />} />
        <Route path='/account/:accountId' element={<AccountHistory />} />
        <Route path='/account/detail/:accountId' element={<AccountDetail />} />
      </Routes>
      <ToastContainer position='top-center' />
      <Footer />
    </Router>
  );
}

export default App;
