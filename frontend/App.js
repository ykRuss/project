// App.js
import React from "react";
import { StoreProvider } from "./redux/store"; // The Redux Store Provider
import AppNavigator from "./AppNavigator";

export default function App() {
  return (
    <StoreProvider>
      <AppNavigator />
    </StoreProvider>
  );
}
