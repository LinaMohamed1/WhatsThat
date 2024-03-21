import React, { useState, useEffect } from 'react'
import { Text, View, TextInput, FlatList, Switch, TouchableOpacity, Modal, TouchableHighlight } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import styles from './styles'

export default function Home () {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState('')
  const [searchInContacts, setSearchInContacts] = useState(true)
  const [searchResultsContacts, setSearchResultsContacts] = useState([])
  const [searchResultsAll, setSearchResultsAll] = useState([])
  const [blockedUsers, setBlockedUsers] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
//gets token and userid and stores them in state to be used throughout the component
  useEffect(() => {
    const getTokenAndUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId')
        setUserId(storedUserId)
        console.log('User ID stored:', storedUserId)

        const storedToken = await AsyncStorage.getItem('token')
        setToken(storedToken)
        console.log('Token stored:', storedToken)
      } catch (error) {
        console.error('Error getting token and user ID:', error)
      }
    }

    getTokenAndUserId()
  }, [])

  useEffect(() => {
    if (token) {
      fetchData('all', setSearchResultsAll)
      fetchData('contacts', setSearchResultsContacts)
    }
  }, [token])

  const fetchData = async (searchIn, setSearchResults) => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/search?q=${searchQuery}&search_in=${searchIn}&limit=20&offset=0`, {
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()

      const userIdNumber = parseInt(userId, 10) //parsing userid to integer
      const filteredData = data.filter(item => item.user_id !== userIdNumber)
      setSearchResults(filteredData)

      console.log(`Fetched data for ${searchIn}:`, data)
    } catch (error) {
      console.error(`Error fetching data for ${searchIn}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const addContact = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      if (!response.ok) {
        throw new Error('Failed to add contact')
      }
      console.log('Contact added successfully')
      fetchData('all', setSearchResultsAll)
      fetchData('contacts', setSearchResultsContacts)
    } catch (error) {
      console.error('Error adding contact:', error)
    }
  }

  const removeContact = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': token
        }
      })
      if (!response.ok) {
        throw new Error('Failed to remove contact')
      }
      console.log('Contact removed successfully')
      fetchData('all', setSearchResultsAll)
      fetchData('contacts', setSearchResultsContacts)
    } catch (error) {
      console.error('Error removing contact:', error)
    }
  }

  const blockContact = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
        method: 'POST',
        headers: {
          'X-Authorization': token
        }
      })
      if (!response.ok) {
        throw new Error('Failed to block contact')
      }
      console.log('Contact blocked successfully')
      fetchData('all', setSearchResultsAll)
      fetchData('contacts', setSearchResultsContacts)
    } catch (error) {
      console.error('Error blocking contact:', error)
    }
  }

  const unblockUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': token
        }
      })
      if (!response.ok) {
        throw new Error('Failed to unblock user')
      }
      console.log('User unblocked successfully')
      fetchData('all', setSearchResultsAll)
      fetchData('contacts', setSearchResultsContacts)
    } catch (error) {
      console.error('Error unblocking user:', error)
    }
  }

  const viewBlockedUsers = async () => {
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/blocked', {
        headers: {
          'X-Authorization': token
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch blocked users')
      }
      const blockedUsersData = await response.json()
      console.log('Blocked users:', blockedUsersData)
      setBlockedUsers(blockedUsersData)
      setModalVisible(true)
    } catch (error) {
      console.error('Error fetching blocked users:', error)
    }
  }

  const handleRemoveContact = (item) => {
    if (searchResultsContacts.some(contact => contact.user_id === item.user_id)) {
      removeContact(item.user_id)
    } else {
    }
  }

  const handleBlockUser = async (item) => {
    try {
      
      await blockContact(item.user_id)
    
      setSearchResults(prevResults => prevResults.filter(user => user.user_id !== item.user_id))
    } catch (error) {
      console.error('Error handling block:', error)
    }
  }

  const handleUnblock = (item) => {
    unblockUser(item.user_id)
  }

  const handleAddContact = (item) => {
    addContact(item.user_id)
  }

  return (
    <View style={styles.container1}>
      <TextInput
        style={styles.searchInput}
        placeholder='Search contacts...'
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <View style={styles.toggleContainer}>
        <Text>{searchInContacts ? 'Contacts' : 'All'}</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={searchInContacts ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor='#3e3e3e'
          onValueChange={() => setSearchInContacts(previousState => !previousState)}
          value={searchInContacts}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => fetchData(searchInContacts ? 'contacts' : 'all', setSearchResults)}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={viewBlockedUsers}>
          <Text style={styles.buttonText}>View Blocked Contacts</Text>
        </TouchableOpacity>
      </View>

      {isLoading && <Text>Loading...</Text>}

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.user_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text>{item.given_name} {item.family_name}</Text>
            {searchResultsContacts.some(contact => contact.user_id === item.user_id)
              ? (
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => handleRemoveContact(item)}>
                    <Ionicons name='person-remove' size={24} color='black' />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleBlockUser(item)}>
                    <Ionicons name='skull' size={24} color='black' />
                  </TouchableOpacity>
                </View>
                )
              : (
                <TouchableOpacity onPress={() => handleAddContact(item)}>
                  <Ionicons name='add-circle' size={24} color='black' />
                </TouchableOpacity>
                )}
          </View>
        )}
      />
      <Modal
        animationType='slide'
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Blocked Contacts:</Text>
            <FlatList
              data={blockedUsers}
              keyExtractor={(item) => item.user_id.toString()}
              renderItem={({ item }) => (
                <View style={styles.blockedUserItem}>
                  <Text>{item.first_name} {item.last_name}</Text>
                  <TouchableOpacity onPress={() => handleUnblock(item)}>
                    <Text style={styles.unblockButton}>Unblock</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={() => {
                setModalVisible(!modalVisible)
              }}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  )
}
