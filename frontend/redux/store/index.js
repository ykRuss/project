import { createStore } from "redux";
import { Provider } from "react-redux"; // Import Provider from react-redux

// A simple reducer
const initialState = {
  user: null,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

// Create a Redux store
const store = createStore(rootReducer);

// StoreProvider component that provides the store to the app
const StoreProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export { store, StoreProvider }; // Export both store and StoreProvider
