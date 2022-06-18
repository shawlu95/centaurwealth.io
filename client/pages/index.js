import Timeline from '../components/timeline';

const LandingPage = ({ points, currentUser }) => {
  return (
    <div>
      <h2>Timeline</h2>
      <Timeline points={points} />
    </div>
  );
};

LandingPage.getInitialProps = async (context, axios, currentUser) => {
  const {
    data: { points },
  } = await axios.get('/api/timeline', { data: { start: '2022-01-01' } });
  return { points, currentUser };
};

export default LandingPage;
