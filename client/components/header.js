import Link from 'next/link';
import Head from 'next/head';

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
          <Link href={href}>
            <a className='nav-link'>{label}</a>
          </Link>
        </li>
      );
    });
  return (
    <div
      style={{
        marginBottom: '20px',
      }}
    >
      <nav className='navbar nav-light bg-light'>
        <Head>
          <title>Centaur</title>
          <meta
            name='viewport'
            content='initial-scale=1.0, width=device-width'
          />
        </Head>

        <Link href='/'>
          <a className='navbar-brand' style={{ marginLeft: '15px' }}>
            Home
          </a>
        </Link>
        <div className='d-flex justify-content-end'>
          <ul className='nav d-flex align-items-center'>{links}</ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
