import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import styles from './styles'
// import { darkStyles } from './darkStyles';
//other components have userid and token as states but here theyre called individually in functions
export default function Settings () {
  const [userData, setUserData] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [profileImage, setProfileImage] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
  
        // fetches user data
        const userDataResponse = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
          headers: {
            'X-Authorization': token,
            'Content-Type': 'application/json'
          }
        });
  
        if (!userDataResponse.ok) {
          console.error('Failed to fetch user data');
          return;
        }
  
        const userData = await userDataResponse.json();
        console.log('User data:', userData);
        setUserData(userData);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setEmail(userData.email);
  
        // fetches profile picture from api
        const profilePicResponse = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
          headers: {
            'X-Authorization': token
          }
        });
  
        if (profilePicResponse.ok) {
          const blob = await profilePicResponse.blob();
          console.log('Profile picture blob:', blob);
          
          const reader = new FileReader();
          reader.onload = () => {
            const base64data = reader.result.split(',')[1]; 
            console.log('Base64 data:', base64data);
            setProfileImage('data:image/jpeg;base64,' + base64data);
          };
          reader.readAsDataURL(blob);
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

  console.log('pic', profileImage);
  

  //could have been the darkmode toggle but didnt implement
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  const handleChangeDetails = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId')
      const token = await AsyncStorage.getItem('token')
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
        method: 'PATCH',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({//uses inputs to form the request body
          first_name: firstName,
          last_name: lastName,
          email,
          password
        })
      })
      if (response.ok) {
        console.log('Success', 'Details updated successfully.')
      } else {
        throw new Error('Failed to update details')
      }
    } catch (error) {
      //console.error('Error updating details:', error)
      Alert.alert('Error', 'Failed to update details. Please try again.')
    }
  }

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Camera roll permissions are required to upload photos.');
        return;
      }  
  
      // then goes into the actual selection
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8
      });    
  
      console.log('Image picker result:', result);
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        if (selectedImage.uri) {
          console.log('Selected image URI:', selectedImage.uri);
          setProfileImage(selectedImage.uri);
          sendToServer(selectedImage.uri);
        } else {
          console.log('Selected image URI is undefined');
        }
      } else {
        console.log('Image selection cancelled or no assets found');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  }  

  const sendToServer = async (imageUri) => {
    try {
      const userID = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
    
      // reads image file
      const response = await fetch(imageUri);
      const imageBlob = await response.blob();
  
  
      const uploadResponse = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/photo`, {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'image/jpeg'//jpeg as placeholder.both png and jpg are supported
        },
        body: imageBlob
      });
    
      if (uploadResponse.ok) {
        console.log('Image uploaded successfully');
        setProfileImage(imageUri);//sets to render in page
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };  

  
  
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/logout', {
        method: 'POST',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        await AsyncStorage.removeItem('token')
        navigation.navigate('Login')
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <View style={[styles.container5, isDarkMode && styles.darkModeContainer]}>
    <View style={styles.userInfoContainer}>
      
      {profileImage ? (
       <Image source={{ uri: profileImage }} style={styles.profileImage} />
       ) : (
        <Ionicons name='person' size={50} color='black' style={styles.profileIcon} />
      )}
      {userData && (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData.first_name} {userData.last_name}</Text>
        </View>
      )}
    </View>
      <TextInput
        style={styles.input1}
        onChangeText={setFirstName}
        placeholder='First Name'
      />
      <TextInput
        style={styles.input1}
        onChangeText={setLastName}
        placeholder='Last Name'
      />
      <TextInput
        style={styles.input1}
        onChangeText={setEmail}
        placeholder='Email'
        keyboardType='email-address'
      />
      <TextInput
        style={styles.input1}
        onChangeText={setPassword}
        placeholder='Password'
        secureTextEntry
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
    </View>
  )
}
