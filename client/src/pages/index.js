import axios from 'axios';
import React, { useEffect } from 'react';

import Timeline from '../components/timeline';

const HomePage = () => {
  useEffect(() => {
    const getUser = async () => {
      const { data } = await axios.get('/api/auth/currentuser');
      // dispatch({ type: USER_LOAD, payload: { currentUser: data.currentUser } });
      console.log(data);
    };
    getUser();
  }, []);

  return (
    <div>
      <Timeline />
    </div>
  );
};

export default HomePage;
