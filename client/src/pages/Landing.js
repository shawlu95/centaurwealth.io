import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Landing = () => {
  const { user } = useSelector((store) => store.user);
  return (
    <Wrapper>
      <div className='container page'>
        <div className='info'>
          <h1>
            Centaur <span>Wealth</span>
          </h1>
          <p>
            While companies today use enterprise resource planning (ERP) systems
            to keep track of widgets, contractual obligations, and employees,
            the accounting system-and the laws that support it-require us to
            convert just about everything into monetary value, and enter it into
            a ledger system based on the 1.0-year-old double-entry bookkeeping
            method. This is the very same system used by the Florentine
            merchants of the 13th century and described by Luca Pacioli, the
            "father of accounting," in his book Summa de Arithmetica, Geometria,
            Proportioni et Proportionalita, published 1494.
          </p>
          {!user && (
            <Link
              to='/auth/signup'
              className='btn btn-primary'
              style={{ marginRight: '15px' }}
            >
              Sign up
            </Link>
          )}
          {!user && (
            <Link to='/auth/signin' className='btn btn-primary-outlined'>
              Sign in
            </Link>
          )}
        </div>
        <img src={main} alt='job hunt' className='img main-img' />
      </div>
    </Wrapper>
  );
};

export default Landing;
