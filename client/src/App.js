import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages';
import { Signin, Signup, Signout } from './pages/auth';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Account, {
  AccountCreate,
  AccountDetail,
  AccountHistory,
} from './pages/account';
import Transaction from './pages/transaction';
import TransactionCreate from './pages/transaction/create';
import TransactionDetail from './pages/transaction/detail';
import TransactionClose from './pages/transaction/close';

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
        <Route
          path='/account/history/:accountId'
          element={<AccountHistory />}
        />
        <Route path='/account/create' element={<AccountCreate />} />
        <Route path='/account/detail/:accountId' element={<AccountDetail />} />
        <Route path='/transaction' element={<Transaction />} />
        <Route path='/transaction/create' element={<TransactionCreate />} />
        <Route
          path='/transaction/close/:accountId'
          element={<TransactionClose />}
        />
        <Route
          path='/transaction/:transactionId'
          element={<TransactionDetail />}
        />
      </Routes>
      <ToastContainer position='top-center' />
      <Footer />
    </Router>
  );
}

export default App;
