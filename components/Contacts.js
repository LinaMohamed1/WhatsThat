import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles, contactBoxWidth } from './styles'; // Import contactBoxWidth from styles
import { Ionicons } from '@expo/vector-icons';

// Import your generic icon image
import noProfileImage from '../assets/profpic.jpeg';

export default function Chat() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://localhost:3333/api/1.0.0/contacts', {
          headers: {
            'X-Authorization': token,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        // Fetch profile pictures for each contact
        const contactsWithImages = await Promise.all(data.map(async (contact) => {
          try {
            const photoResponse = await fetch(`http://localhost:3333/api/1.0.0/user/${contact.user_id}/photo`, {
              headers: {
                'X-Authorization': token,
              },
            });
            if (photoResponse.ok) {
              const photoBlob = await photoResponse.blob();
              const reader = new FileReader();
              reader.onload = () => {
                const base64data = reader.result.split(',')[1];
                setContacts(prevContacts => [...prevContacts, { ...contact, photo: base64data }]);
              };
              reader.readAsDataURL(photoBlob);
            } else {
              // If profile picture not found, set default image
              setContacts(prevContacts => [...prevContacts, { ...contact, photo: noProfileImage }]);
            }
          } catch (error) {
            console.error('Error fetching photo:', error);
          }
        }));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          <Text>Welcome to the Contacts Screen!</Text>
          <Text>Contacts:</Text>
          <View>
            {contacts.map((contact, index) => (
              <View key={index} style={[styles.contactBox, { width: contactBoxWidth }]}>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.button} onPress={() => { /* Handle chat action */ }}>
                    <Ionicons name="chatbubble" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <Image
                  source={{ uri: `data:image/jpeg;base64,${contact.photo}` }}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
                <Text>{contact.first_name} {contact.last_name}</Text>
                <Text>Email: {contact.email}</Text>
                <Text>User ID: {contact.user_id}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
