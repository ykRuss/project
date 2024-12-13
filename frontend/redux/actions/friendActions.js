// actions/friendActions.js
export const addFriend = (friend) => ({
  type: "ADD_FRIEND",
  payload: friend,
});

export const removeFriend = (id) => ({
  type: "REMOVE_FRIEND",
  payload: id,
});
