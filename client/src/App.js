import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/header';
import Footer from './components/footer';
import Home from './pages';
import Signin from './pages/auth/signin';
function App() {
  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth/signin' element={<Signin />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

// // global css files must be imported here
// import './index.css';
// import 'bootstrap/dist/css/bootstrap.css';
// import buildClient from '../api/build-client';
// import Header from '../components/header';
// import Footer from '../components/footer';

// import Timeline from '../components/timeline';
// import Cards from '../components/cards';
// const LandingPage = ({ summary }) => {
//   return (
//     <div className='d-grid gap-3'>
//       <h2>Timeline</h2>
//       <Timeline />
//       <Cards summary={summary} />
//     </div>
//   );
// };

// LandingPage.getInitialProps = async (context, axios, currentUser) => {
//   if (currentUser === null) {
//     context.res.writeHead(302, { Location: '/auth/signin' });
//     context.res.end();
//   }
//   const {
//     data: { summary },
//   } = await axios.get('/api/balance/current');
//   return { summary, currentUser };
// };

// /**
//  * @dev NextJS will wrap component in custom wrap component
//  * @dev Common props are returned from getInitialProps and
//  * drilled down to every component
//  */
// const AppComponent = ({ Component, pageProps, currentUser }) => {
//   return (
//     <div>
//       <Header currentUser={currentUser} />
//       <div className='container page-100'>
//         <Component currentUser={currentUser} {...pageProps} />
//       </div>
//       <Footer />
//     </div>
//   );
// };

// AppComponent.getInitialProps = async (appContext) => {
//   const axios = buildClient(appContext.ctx);
//   const { data } = await axios.get('/api/auth/currentuser');

//   let pageProps;
//   if (appContext.Component.getInitialProps) {
//     // invoking child component's getInitialProps, pass down useful info
//     pageProps = await appContext.Component.getInitialProps(
//       appContext.ctx,
//       axios,
//       data.currentUser
//     );
//   }

//   return {
//     ...data,
//     pageProps,
//   };
// };

// export default AppComponent;
