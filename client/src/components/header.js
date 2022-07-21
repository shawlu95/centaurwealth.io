import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const { user } = useSelector((store) => store.user);
  const links = [
    !user && { label: 'Sign up', href: '/auth/signup' },
    !user && { label: 'Sign in', href: '/auth/signin' },
    user && { label: 'Accounts', href: '/account' },
    user && { label: 'Transactions', href: '/transaction' },
    user && { label: 'Budgets', href: '/budget' },
    user && { label: 'Sign out', href: '/auth/signout' },
  ]
    .filter((config) => config)
    .map(({ label, href }) => {
      return (
        <li key={href} className='nav-item'>
          <Link to={href} className='nav-link'>
            {label}
          </Link>
        </li>
      );
    });
  return (
    <div
      style={{
        marginBottom: '2rem',
      }}
    >
      <nav className='navbar nav-light bg-light'>
        <Link
          to='/home'
          className='nav-link'
          style={{ marginLeft: '15px', color: 'primary-400' }}
        >
          Home
        </Link>
        <div className='d-flex justify-content-end'>
          <ul className='nav d-flex align-items-center'>{links}</ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
