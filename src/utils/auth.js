import Cookie from 'js-cookie'

const TokenKey = 'jilijli-token';
const UserKey = "current-user"


export const getToken = () => {
  return Cookie.get(TokenKey)
}


export const setToken = (token) => {
  return Cookie.set(TokenKey, token);
}

export const removeToken = () => {
  return Cookie.remove(TokenKey);
}


export const getCurrentUser = () => {
  let user = Cookie.get(UserKey)
  return user === undefined ? null : JSON.parse(user)
}


export const setCurrentUser = (currentUser) => {
  return Cookie.set(UserKey, JSON.stringify(currentUser));
}

export const removeCurrentUser = () => {
  return Cookie.remove(UserKey);
}
