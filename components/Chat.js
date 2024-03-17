import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatDetails from './ChatDetails';
import { useNavigation } from '@react-navigation/native';

const BASE_URL = 'http://localhost:3333/api/1.0.0';

export default function Chat() {
  const [token, setToken] = useState('');
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatName, setChatName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [chatDetails, setChatDetails] = useState(null); 

  useEffect(() => {
    const getTokenAndFetchChats = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);
        console.log('Token stored:', storedToken);
      } catch (error) {
        console.error('Error getting token:', error);
      }
    };
  
    getTokenAndFetchChats();
  }, []);
  
  useEffect(() => {
    if (token) {
      fetchChats();
    }
  }, [token]);
  
  

  const fetchChats = async () => {
    try {
      console.log('Fetching chats...'); // Add console log to indicate the start of fetching chats
      console.log('Token:', token); // Log the token to verify if it's correctly set
  
      const response = await fetch(`${BASE_URL}/chat`, {
        headers: {
          'X-authorization': token,
        },
      });
  
      console.log('Response status:', response.status); // Log the response status
  
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched chats:', data); // Log the fetched chats data
        setChats(data); // Update chats state with the fetched data
      } else {
        console.error('Failed to fetch chats:', response.status);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };  
  

        const handleChatSelection = (chatId) => {
          console.log('Selected chat ID:', chatId);
          fetchChatDetails(chatId);
        };
  
  

  const fetchChatDetails = async (chatId) => {
    try {
      const response = await fetch(`${BASE_URL}/chat/${chatId}?limit=8&offset=0`, {
        headers: {
          'X-authorization': token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setChatDetails(data);
        setIsModalVisible(true); // Show modal
      } else {
        console.error('Failed to fetch chat details:', response.status);
      }
    } catch (error) {
      console.error('Error fetching chat details:', error);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setChatDetails(null); // Clear chat details
  };

  const handleSubmit = async () =>{};
  

  const createNewChat = async () => {
    if (!chatName) {
      Alert.alert('Error', 'Please enter a chat name');
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-authorization': token,
        },
        body: JSON.stringify({ name: chatName }),
      });
      if (response.ok) {
        const data = await response.json();
        const { chat_id } = data; // Extract chat_id from response
        setSelectedChat({ id: chat_id, token }); // Set selected chat ID and token
        Alert.alert('Success', 'New chat created successfully');
        setIsModalVisible(false);
        fetchChats();
      } else {
        Alert.alert('Error', 'Failed to create new chat');
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      Alert.alert('Error', 'Failed to create new chat');
    }
  };
  

  return (
    <View>
      {chats.map((chat) => (
        <View key={chat.id}>
          <Text>{chat.name}</Text>
          <Button
              title="View Details"
              onPress={() => handleChatSelection(chat.chat_id)}
            />
        </View>
      ))}
     <Modal visible={isModalVisible} animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text>Chat Details</Text>
      {/* Add text input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your message"
        onChangeText={(text) => setMessage(text)}
      />
      {/* Add submit button */}
      <Button title="Submit" onPress={handleSubmit} />
      {/* Display chat details */}
      {chatDetails && (
        <View>
          <Text>Chat ID: {chatDetails.id}</Text>
          <Text>Chat Name: {chatDetails.name}</Text>
          <Text>Creator: {chatDetails.creator.first_name} {chatDetails.creator.last_name}</Text>
          <Text>Members:</Text>
          <FlatList
            data={chatDetails.members}
            keyExtractor={(item) => item.user_id.toString()}
            renderItem={({ item }) => (
              <Text>{item.first_name} {item.last_name}</Text>
            )}
          />
          <Text>Messages:</Text>
          <FlatList
            data={chatDetails.messages}
            keyExtractor={(item) => item.message_id.toString()}
            renderItem={({ item }) => (
              <View style={styles.messageContainer}>
                <Text>Message ID: {item.message_id}</Text>
                <Text>Timestamp: {item.timestamp}</Text>
                <Text>Message: {item.message}</Text>
                <Text>Author: {item.author.first_name} {item.author.last_name}</Text>
              </View>
            )}
          />
        </View>
      )}
      <Button title="Close" onPress={closeModal} />
    </View>
  </View>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%', // Adjust width as needed
    height: '80%', // Adjust max height as needed
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
