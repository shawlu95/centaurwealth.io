import Timeline from '../components/timeline';
import Cards from '../components/cards';

const LandingPage = ({ summary }) => {
  return (
    <div className='d-grid gap-3'>
      <h2>Timeline</h2>
      <Timeline />
      <Cards summary={summary} />
    </div>
  );
};

LandingPage.getInitialProps = async (context, axios, currentUser) => {
  if (currentUser === null) {
    context.res.writeHead(302, { Location: '/auth/signin' });
    context.res.end();
  }
  const {
    data: { summary },
  } = await axios.get('/api/balance/current');
  return { summary, currentUser };
};

export default LandingPage;
