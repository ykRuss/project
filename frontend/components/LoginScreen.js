import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useDispatch } from "react-redux";
import axios from "axios";
import * as SecureStore from "expo-secure-store"; // For storing the token securely
import { login } from "../redux/actions/authActions";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://192.168.2.207:3000/api/auth/login",
        { email, password }
      );

      console.log("Login response data:", response.data); // Log response data

      if (response.data && response.data.token) {
        // Store the token securely
        await SecureStore.setItemAsync("authToken", response.data.token);
        dispatch(login(response.data.user, response.data.token)); // Update Redux state with user and token
        navigation.replace("Main"); // Navigate to dashboard
      } else {
        console.error("Token not found in the response");
        alert("Login failed. Token not received.");
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />

      <Text style={styles.registerPrompt}>
        Don't have an account?{" "}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate("Register")}
        >
          Register here
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  registerPrompt: {
    marginTop: 20,
    textAlign: "center",
  },
  registerLink: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
