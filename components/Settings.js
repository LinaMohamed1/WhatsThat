import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './styles';
import { darkStyles } from './darkStyles';

export default function Settings() {
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
  
        // Fetch user data
        const userDataResponse = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
          headers: {
            'X-Authorization': token,
            'Content-Type': 'application/json',
          },
        });
  
        if (!userDataResponse.ok) {
          console.error('Failed to fetch user data');
          return;
        }
  
        const userData = await userDataResponse.json();
        setUserData(userData);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setEmail(userData.email);
  
        // Fetch profile picture
        const profilePicResponse = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
          headers: {
            'X-Authorization': token,
          },
        });
  
        if (profilePicResponse.ok) {
          const blob = await profilePicResponse.blob(); // Get blob response
          setProfileImage(URL.createObjectURL(blob)); // Convert blob to URL and set as profile image
          console.log('Profile picture fetched successfully');
        } else {
          console.error('Failed to fetch profile picture');
        }
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  


  const getProfilePic = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
  
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
        headers: {
          'X-Authorization': token,
        },
      });
  
      if (response.ok) {
        console.log('response',response);
        const blob = await response.blob(); // Get blob response
        setProfileImage(URL.createObjectURL(blob)); // Convert blob to URL and set as profile image
      } else {
        console.error('Failed to fetch profile picture');
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };
  

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleChangeDetails = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
        method: 'PATCH',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        }),
      });
      if (response.ok) {
        // Details updated successfully
        console.log('Success', 'Details updated successfully.');
      } else {
        throw new Error('Failed to update details');
      }
    } catch (error) {
      console.error('Error updating details:', error);
      Alert.alert('Error', 'Failed to update details. Please try again.');
    }
  };

  const pickImage = async () => {
    // Request Camera Roll Permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Camera roll permissions are required to upload photos.');
      return;
    }

    // Launch Image Picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri); // Store selected image URI
      uploadImage(result.uri); // Call the upload function
    }
  };

  const uploadImage = async (imageData) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
  
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'image/png', // Set content type to JPEG
        },
        body: imageData, // Pass the image data directly as the body
      });
  
      if (response.ok) {
        console.log('Success', 'Profile picture updated.');
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };  

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/logout', {
        method: 'POST',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        await AsyncStorage.removeItem('token');
        navigation.navigate('Login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkModeContainer]}>
      <View style={styles.userInfoContainer}>
      {profileImage ? (
  <Image source={{ uri: profileImage }} style={styles.profileImage} />
) : (
  <Ionicons name="person" size={50} color="black" style={styles.profileIcon} />
)}
        {userData && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData.first_name} {userData.last_name}</Text>
          </View>
        )}
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setFirstName}
        placeholder="First Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={setLastName}
        placeholder="Last Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangeDetails}>
        <Text style={styles.buttonText}>Change Details</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Change Profile Picture</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={getProfilePic}>
          <Text style={styles.buttonText}>Get Profile Picture</Text>
      </TouchableOpacity>
      <View style={[styles.container, isDarkMode && darkStyles.container]}>
        <Text style={[styles.title, isDarkMode && darkStyles.title]}>Title</Text>
        <TouchableOpacity onPress={toggleDarkMode}>
          <Text>Toggle Dark Mode</Text>
        </TouchableOpacity>
        {profileImage && (
    <Image
      source={{ uri: profileImage }}
      style={styles.profileImage}
    />
  )}
      </View>
    </View>
  );
}
