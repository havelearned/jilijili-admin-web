import Cookie from 'js-cookie'

const TokenKey = 'jilijli-token';


export const getToken = () => {
  return Cookie.get(TokenKey)
}


export const setToken = (token) => {
  return Cookie.set(TokenKey, token);
}

export const removeToken = () => {
  return Cookie.remove(TokenKey);
}
