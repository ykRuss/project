// actions/authActions.js
export const login = (user, token) => ({
  type: "LOGIN",
  payload: { user, token },
});

export const logout = () => ({
  type: "LOGOUT",
});
