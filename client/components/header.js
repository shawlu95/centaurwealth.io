import Link from 'next/link';
const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign up', href: '/auth/signup' },
    !currentUser && { label: 'Sign in', href: '/auth/signin' },
    currentUser && { label: 'New Account', href: '/accounts/create' },
    currentUser && { label: 'New Transaction', href: '/transactions/create' },
    currentUser && { label: 'My Transactions', href: '/transactions' },
    currentUser && { label: 'Sign out', href: '/auth/signout' },
  ]
    .filter((config) => config)
    .map(({ label, href }) => {
      return (
        <li key={href} className='nav-item'>
          <Link href={href}>
            <a className='nav-link'>{label}</a>
          </Link>
        </li>
      );
    });
  return (
    <nav className='navbar nav-light bg-light'>
      <Link href='/'>
        <a className='navbar-brand'>Home</a>
      </Link>
      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-cent er'>{links}</ul>
      </div>
    </nav>
  );
};

export default Header;