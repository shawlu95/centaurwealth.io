export const addUserToLocalStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUserFromLocalStorage = () => {
  const result = localStorage.getItem('user');
  return result ? JSON.parse(result) : null;
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('user');
};
