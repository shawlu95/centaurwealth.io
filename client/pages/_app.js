// global css files must be imported here
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';
import Footer from '../components/footer';

/**
 * @dev NextJS will wrap component in custom wrap component
 * @dev Common props are returned from getInitialProps and
 * drilled down to every component
 */
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className='container page-100'>
        <Component currentUser={currentUser} {...pageProps} />
      </div>
      <Footer />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const axios = buildClient(appContext.ctx);
  const { data } = await axios.get('/api/auth/currentuser');

  let pageProps;
  if (appContext.Component.getInitialProps) {
    // invoking child component's getInitialProps, pass down useful info
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      axios,
      data.currentUser
    );
  }

  return {
    ...data,
    pageProps,
  };
};

export default AppComponent;
