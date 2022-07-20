import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Header, Footer } from './components';
import Home, { Landing, Error } from './pages';
import { Signin, Signup, Signout } from './pages/auth';
import Account, {
  AccountCreate,
  AccountDetail,
  AccountHistory,
} from './pages/account';
import Transaction, {
  TransactionClose,
  TransactionCreate,
  TransactionDetail,
} from './pages/transaction';
import Budget, {
  BudgetCreate,
  BudgetHistory,
  BudgetUpdate,
} from './pages/budget';

function App() {
  const { user } = useSelector((store) => store.user);
  return (
    <Router>
      <Header currentUser={user} />
      <Routes>
        <Route path='/' element={<Landing currentUser={user} />} />
        <Route path='/home' element={<Home />} />

        <Route path='/auth/signin' element={<Signin />} />
        <Route path='/auth/signup' element={<Signup />} />
        <Route path='/auth/signout' element={<Signout />} />

        <Route path='/account' element={<Account />} />
        <Route path='/account/create' element={<AccountCreate />} />
        <Route path='/account/detail/:accountId' element={<AccountDetail />} />
        <Route
          path='/account/history/:accountId'
          element={<AccountHistory />}
        />

        <Route path='/transaction' element={<Transaction />} />
        <Route
          path='/transaction/close/:accountId'
          element={<TransactionClose />}
        />
        <Route path='/transaction/create' element={<TransactionCreate />} />
        <Route
          path='/transaction/:transactionId'
          element={<TransactionDetail />}
        />

        <Route path='/budget' element={<Budget />} />
        <Route path='/budget/create' element={<BudgetCreate />} />
        <Route path='/budget/history' element={<BudgetHistory />} />
        <Route path='/budget/update' element={<BudgetUpdate />} />

        <Route path='*' element={<Error />} />
      </Routes>
      <ToastContainer position='top-left' />
      <Footer />
    </Router>
  );
}

export default App;
