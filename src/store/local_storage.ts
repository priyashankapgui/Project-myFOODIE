
const USER = "USER";
const TOKEN = "TOKEN";

export const getLocalUser = () =>
  
  JSON.parse(localStorage.getItem(USER) || "{}");

export const setLocalUser = (user = {}) =>
  localStorage.setItem(USER, JSON.stringify(user || {}));
 

export const getToken = () => `Bearer ${localStorage.getItem(TOKEN)}`;


export const setToken = (token = '') => {
  localStorage.setItem(TOKEN, token);

};

export const logoutUser = () => {
  localStorage.removeItem(TOKEN)
  localStorage.removeItem(USER); 
};
