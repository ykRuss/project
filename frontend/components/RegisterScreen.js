import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Password validation
  const validatePassword = () => password.length >= 8;

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    // Validate password
    if (!validatePassword()) {
      setLoading(false);
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.2.207:3000/api/auth/register",
        {
          email,
          username,
          password,
        }
      );

      if (response.data.message === "User registered successfully") {
        navigation.navigate("Login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Your Aspire Account Today</Text>
      <TextInput
        style={styles.inputField}
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        required
      />
      <TextInput
        style={styles.inputField}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        required
      />
      <TextInput
        style={styles.inputField}
        placeholder="Enter a strong password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        required
      />
      <Button
        title={loading ? "Registering..." : "Create Account"}
        onPress={handleRegister}
        disabled={loading}
      />
      {error ? <Text style={styles.errorAlert}>{error}</Text> : null}
      <View style={styles.links}>
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          Already have an account? Log in
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputField: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  errorAlert: {
    color: "red",
    marginTop: 10,
  },
  links: {
    marginTop: 15,
  },
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
