// reducers/friendReducer.js
const initialState = {
  friends: [],
};

export default function friendReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_FRIEND":
      return { ...state, friends: [...state.friends, action.payload] };
    case "REMOVE_FRIEND":
      return {
        ...state,
        friends: state.friends.filter((friend) => friend.id !== action.payload),
      };
    default:
      return state;
  }
}
