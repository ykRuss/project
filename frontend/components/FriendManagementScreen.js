import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const FriendManagementScreen = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);

  const getAuthToken = async () => {
    try {
      return await SecureStore.getItemAsync("authToken");
    } catch (err) {
      setError("Failed to retrieve auth token.");
      return null;
    }
  };

  const getFriends = async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await axios.get(
        "http://192.168.2.207:3000/api/friends/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Debugging: log the response data
      console.log("Friends response data:", response.data);

      const { acceptedFriends, pendingReceivedRequests, sentRequests } =
        response.data;

      // Handle nested structure for accepted friends
      setFriends(acceptedFriends || []);
      setPendingRequests(pendingReceivedRequests || []);
      setSentRequests(sentRequests || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching friends");
    }
  };

  const sendFriendRequest = async (friendId) => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await axios.post(
        "http://192.168.2.207:3000/api/friends/request",
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", response.data.message);
      setModalVisible(false); // Close modal after adding a friend
      getFriends();
    } catch (err) {
      setError(err.response?.data?.message || "Error sending friend request");
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await axios.put(
        `http://192.168.2.207:3000/api/friends/accept/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", response.data.message);
      getFriends();
    } catch (err) {
      setError(err.response?.data?.message || "Error accepting friend request");
    }
  };

  const removeFriend = async (friendId) => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await axios.delete(
        `http://192.168.2.207:3000/api/friends/${friendId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", response.data.message);
      getFriends();
    } catch (err) {
      setError(err.response?.data?.message || "Error removing friend");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await axios.get(
        "http://192.168.2.207:3000/api/friends/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllUsers(response.data.users || []);
      setFilteredUsers(response.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching users");
    }
  };

  const filterUsers = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    getFriends();
    fetchAllUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend Management</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Friend</Text>
      </TouchableOpacity>

      {/* Modal for Searching Users */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Friend</Text>
            <TextInput
              style={styles.input}
              placeholder="Search by username"
              value={searchQuery}
              onChangeText={filterUsers}
            />
            {/* Replaced ScrollView with FlatList */}
            <FlatList
              data={filteredUsers}
              renderItem={({ item }) => (
                <View style={styles.friendItem}>
                  <Text>
                    {item.username} ({item.email})
                  </Text>
                  <Button
                    title="Add"
                    onPress={() => sendFriendRequest(item._id)}
                    color="blue"
                  />
                </View>
              )}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={<Text>No users found.</Text>}
            />
            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>

      {/* Friends List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friends List</Text>
        <FlatList
          data={friends}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Text>
                {item.username} ({item.email})
              </Text>
              <Button
                title="Remove"
                onPress={() => removeFriend(item._id)}
                color="red"
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<Text>No friends yet.</Text>}
        />
      </View>

      {/* Pending Requests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Friend Requests</Text>
        <FlatList
          data={pendingRequests}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Text>
                {item.username} ({item.email})
              </Text>
              <Button
                title="Accept"
                onPress={() => acceptFriendRequest(item._id)}
                color="green"
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<Text>No pending requests.</Text>}
        />
      </View>

      {/* Sent Friend Requests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sent Friend Requests</Text>
        <FlatList
          data={sentRequests}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Text>
                {item.friend?.username ? item.friend.username : "No username"}{" "}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<Text>No sent requests.</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: "80%", // Limit modal height
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  friendItem: {
    marginVertical: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default FriendManagementScreen;
