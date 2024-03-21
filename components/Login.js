import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'
import styles from './styles'

export default function Login ({ onLogin, navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
//passes prop to app.js so it can go to home page when logged in
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      if (response.ok) {
        //console.log('pass', password) for testing purposes
        //console.log('email', email)
        const data = await response.json()
        //console.log('ID:', data.id)
        //console.log('Token:', data.token)
        await AsyncStorage.setItem('token', data.token)
        await AsyncStorage.setItem('userId', data.id)
        onLogin()
      } else {
        console.error('Login failed')
      }
    } catch (error) {
      console.error('Error logging in:', error)
    }
  }

  const handleRegister = () => {
    navigation.navigate('Register')
  }

  return (
    <View style={styles.container5}>
      <Text>Login Screen</Text>
      <TextInput
        placeholder='Enter your email'
        style={styles.input3}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder='Enter your password'
        secureTextEntry
        style={styles.input3}
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.customButton]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.customButton]}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
