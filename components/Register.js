import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import  styles  from './styles';

export default function Register({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });

      if (response.ok) {
        navigation.navigate('Login');
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <View style={styles.container1}>
      <Text>Register Screen</Text>
      <TextInput
        placeholder="Enter your first name"
        style={styles.input3}
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder="Enter your last name"
        style={styles.input3}
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        placeholder="Enter your email"
        style={styles.input3}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Enter your password"
        style={styles.input3}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
  <TouchableOpacity style={[styles.button, { width: 100 }]} onPress={handleRegister}>
    <Text style={styles.buttonText}>Register</Text>
  </TouchableOpacity>
    <TouchableOpacity style={[styles.button, { width: 150 }]} onPress={() => { navigation.goBack(); }}>
  <Text style={styles.buttonText}>Go Back To Login</Text>
  </TouchableOpacity>
    </View>
  );
}