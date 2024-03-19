// ChatDetails.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { styles } from './styles';

const BASE_URL = 'http://localhost:3333/api/1.0.0';

export default function ChatDetails({ chatId, token }) {
    useEffect(() => {
      console.log("Received chat ID:", chatId); // Add this line to log the received chat ID
      fetchChatDetails(chatId);
    }, [chatId, token]); // Update when chatId changes

  const fetchChatDetails = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/chat/${id}?limit=20&offset=0`, {
        headers: {
          'X-authorization': token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setChatDetails(data);
      } else {
        console.error('Failed to fetch chat details:', response.status);
      }
    } catch (error) {
      console.error('Error fetching chat details:', error);
    }
  };  

  if (!chatDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Chat ID: {chatDetails.id}</Text>
      <Text>Chat Name: {chatDetails.name}</Text>
      <Text>Creator: {chatDetails.creator.first_name} {chatDetails.creator.last_name}</Text>
      <Text>Members:</Text>
      {chatDetails.members.map(member => (
        <Text key={member.user_id}>{member.first_name} {member.last_name}</Text>
      ))}
      <Text>Messages:</Text>
      {chatDetails.messages.map(message => (
        <View key={message.message_id} style={styles.messageContainer}>
          <Text>Message ID: {message.message_id}</Text>
          <Text>Timestamp: {message.timestamp}</Text>
          <Text>Message: {message.message}</Text>
          <Text>Author: {message.author.first_name} {message.author.last_name}</Text>
        </View>
      ))}
    </View>
  );
}
/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
});
*/