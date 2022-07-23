import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LANDING_TEXT } from '../utils/text';

const Landing = () => {
  const { user } = useSelector((store) => store.user);
  return (
    <Wrapper>
      <div className='container page'>
        <div className='info'>
          <h1>
            Centaur <span>Wealth</span>
          </h1>
          <p>{LANDING_TEXT}</p>
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
