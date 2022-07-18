import axios from 'axios';
import React, { useEffect, useContext, useReducer } from 'react';
import reducer from '../reducers/reducer';
import { LOAD_USER } from '../utils';

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
      dispatch({ type: LOAD_USER, payload: { currentUser: data.currentUser } });
    };
    getUser();
  }, []);

  return (
    <AppContext.Provider value={{ ...state }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
