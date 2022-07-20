import { Link } from 'react-router-dom';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign up', href: '/auth/signup' },
    !currentUser && { label: 'Sign in', href: '/auth/signin' },
    currentUser && { label: 'Accounts', href: '/account' },
    currentUser && { label: 'Transactions', href: '/transaction' },
    currentUser && { label: 'Budgets', href: '/budget' },
    currentUser && { label: 'Sign out', href: '/auth/signout' },
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
