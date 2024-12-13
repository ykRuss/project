// reducers/goalReducer.js
const initialState = {
  goals: [],
};

export default function goalReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_GOAL":
      return { ...state, goals: [...state.goals, action.payload] };
    case "REMOVE_GOAL":
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.payload),
      };
    case "SET_GOALS":
      return { ...state, goals: action.payload };
    default:
      return state;
  }
}
