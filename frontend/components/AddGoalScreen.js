import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const AddGoalScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddGoal = async () => {
    if (!title || !description || !deadline) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const authToken = await SecureStore.getItemAsync("authToken");

      if (!authToken) {
        setError("No auth token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://192.168.2.207:3000/api/goals/add",
        {
          title,
          description,
          deadline,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Send token in the header
          },
        }
      );

      if (response.data) {
        navigation.goBack(); // Navigate back to the previous screen
      }
    } catch (err) {
      console.error("Error adding goal:", err);
      setError("Failed to add goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>Add Goal</Text>
      {error && <Text>{error}</Text>}
      <TextInput
        placeholder="Goal Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Deadline (YYYY-MM-DD)"
        value={deadline}
        onChangeText={setDeadline}
      />
      <Button
        title={loading ? "Saving..." : "Save Goal"}
        onPress={handleAddGoal}
        disabled={loading}
      />
    </View>
  );
};

export default AddGoalScreen;
