export const addToLocalStorage = (k, v) => {
  localStorage.setItem(k, JSON.stringify(v));
};

export const getFromLocalStorage = (k) => {
  const result = localStorage.getItem(k);
  return result ? JSON.parse(result) : null;
};

export const removeFromLocalStorage = (k) => {
  localStorage.removeItem(k);
};
