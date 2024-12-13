// actions/goalActions.js
export const addGoal = (goal) => ({
  type: "ADD_GOAL",
  payload: goal,
});

export const removeGoal = (id) => ({
  type: "REMOVE_GOAL",
  payload: id,
});

export const setGoals = (goals) => ({
  type: "SET_GOALS",
  payload: goals,
});
