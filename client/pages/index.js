import Timeline from '../components/timeline';

const LandingPage = ({ currentUser }) => {
  return (
    <div>
      <h2>Timeline</h2>
      <Timeline />
    </div>
  );
};

LandingPage.getInitialProps = async (context, axios, currentUser) => {
  return { currentUser };
};

export default LandingPage;
