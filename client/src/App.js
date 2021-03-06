import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Header, Footer } from './components';
import Home, { Landing, Error, ProtectedRoute, SharedLayout } from './pages';
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
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Landing />} />

        <Route path='/auth/signin' element={<Signin />} />
        <Route path='/auth/signup' element={<Signup />} />
        <Route path='/auth/signout' element={<Signout />} />

        <Route
          path='/'
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route path='/home' element={<Home />} />

          <Route path='/account' element={<Account />} />
          <Route path='/account/create' element={<AccountCreate />} />
          <Route
            path='/account/detail/:accountId'
            element={<AccountDetail />}
          />
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
        </Route>

        <Route path='*' element={<Error />} />
      </Routes>
      <ToastContainer position='top-left' autoClose={1000} />
      <Footer />
    </Router>
  );
}

export default App;
