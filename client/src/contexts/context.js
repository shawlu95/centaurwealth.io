import axios from 'axios';
import React, { useEffect, useContext, useReducer } from 'react';
import reducer from '../reducers/reducer';
import { USER_LOAD, USER_SIGNIN } from '../utils';

const initialState = {
  accounts: [],
  currentUser: null,
};

const AppContext = React.createContext();

export const ContextProvider = ({ children }) => {
  console.log(initialState);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await axios.get('/api/auth/currentuser');
      dispatch({ type: USER_LOAD, payload: data.currentUser });
    };
    getUser();
  }, []);

  const signin = async ({ email, password }) => {
    const res = await axios.post('/api/auth/signin', {
      email,
      password,
    });

    dispatch({ type: USER_SIGNIN, payload: res.data });
  };

  return (
    <AppContext.Provider value={{ ...state, signin }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
