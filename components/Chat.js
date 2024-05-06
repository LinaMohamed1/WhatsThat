import React, { useState, useEffect } from 'react'
import { Text, View, TextInput, FlatList, Alert, Modal, ScrollView, Image, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import ChatDetails from './ChatDetails'; old component. decided to merge into one large component here
import { useNavigation } from '@react-navigation/native' //used when we had the chat components more compartmentalsied
import { Ionicons } from '@expo/vector-icons'
import styles from './styles'

const BASE_URL = 'http://localhost:3333/api/1.0.0'

export default function Chat () {
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState('')
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [selectedMessageId, setSelectedMessageId] = useState(null)
  const [messages, setMessages] = useState([])
  const [chatName, setChatName] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [chatDetails, setChatDetails] = useState(null)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [showSecondModal, setShowSecondModal] = useState(false) 
  const [showContactsModal, setShowContactsModal] = useState(false)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [addContactsModalList, setAddContactsModalList] = useState(false)
  const [removeContactsModalList, setRemoveContactsModalList] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editedMessage, setEditedMessage] = useState('')
  const [originalMessage, setOriginalMessage] = useState('')
  const [updateChatInformationModal, setUpdateChatInformationModal] = useState(false);

  useEffect(() => {
    const getTokenAndFetchChats = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token')
        const storedUserId = await AsyncStorage.getItem('userId')
        setUserId(storedUserId)
        setToken(storedToken)
        console.log('Token stored:', storedToken)
      } catch (error) {
        console.error('Error getting token:', error)
      }
    }

    getTokenAndFetchChats()
  }, [])

  useEffect(() => {
    if (token) {
      fetchChats()
    }
  }, [token])
//some of the below functions are used or variants are used in other components. perhaps we could have exported them from a file instead of re-writing?
  const fetchContacts = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem('token')
      setContacts([])
      const response = await fetch('http://localhost:3333/api/1.0.0/contacts', {
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()

        await Promise.all(data.map(async (contact) => {
          try {
            const photoResponse = await fetch(`http://localhost:3333/api/1.0.0/user/${contact.user_id}/photo`, {
              headers: {
                'X-Authorization': token
              }
            })
            if (photoResponse.ok) {
              const photoBlob = await photoResponse.blob()
              const reader = new FileReader()
              reader.onload = () => {
                const base64data = reader.result.split(',')[1]
                setContacts(prevContacts => [...prevContacts, { ...contact, photo: base64data }])
              }
              reader.readAsDataURL(photoBlob)
            } else {
              setContacts(prevContacts => [...prevContacts, { ...contact, photo: noProfileImage }])
            }
          } catch (error) {
            console.error('Error fetching photo:', error)
          }
        }))
        setShowContactsModal(true)
      } else {
        console.error('Failed to fetch contacts:', response.status)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      setLoading(false)
    }
  }

  const createChat = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: chatName // gets chatname from textbox
        })
      })
      if (response.ok) {
        const data = await response.json()
        console.log('Chat ID:', data.chat_id)
      } else {
        console.error('Failed to create chat:', response.status)
      }
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  const updateChatInformation = async (chatId) => {
    try {
      const token = await AsyncStorage.getItem('token')
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
        method: 'PATCH',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editedMessage 
        })
      })
      if (response.ok) {
        const data = await response.json()
        console.log('success')
      } else {
        console.error('Failed to edit chat:', response.status)
      }
    } catch (error) {
      console.error('Error editing chat:', error)
    }
  }

  const addUserToChat = async (chatId, userId) => {
    try {
      const token = await AsyncStorage.getItem('token')
      const url = `http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Authorization': token
        }
      })
      if (response.ok) {
        console.log('User added to chat successfully')
        }
         else {
        console.error('Failed to add user to chat:', response.status)
      }
    } catch (error) {
      console.error('Error adding user to chat:', error)
    }
  }

  const removeUserFromChat = async (chatId, userId) => {
    try {
      const token = await AsyncStorage.getItem('token')
      const url = `http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'X-Authorization': token
        }
      })
      if (response.ok) {
        console.log('User removed from chat successfully')
      } else {
        console.error('Failed to remove user from chat:', response.status)
      }
    } catch (error) {
      console.error('Error removing user from chat:', error)
    }
  }

  const fetchChats = async () => {
    try {
      console.log('Fetching chats...')
      console.log('Token:', token)

      const response = await fetch(`http://localhost:3333/api/1.0.0/chat`, {
        headers: {
          'X-authorization': token
        }
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Fetched chats:', data)
        setChats(data)
      } else {
        console.error('Failed to fetch chats:', response.status)
      }
    } catch (error) {
      console.error('Error fetching chats:', error)
    }
  }

  const handleChatSelection = (chatId) => {
    console.log('Selected chat ID:', chatId)
    setSelectedChat(chatId)
    fetchChatDetails(chatId)
  }

  const fetchChatDetails = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}?limit=20&offset=0`, {
        headers: {
          'X-authorization': token
        }
      })
      if (response.ok) {
        const data = await response.json()
        console.log('chat data', data)
        setChatDetails(data)
        setIsModalVisible(true)
      } else {
        console.error('Failed to fetch chat details:', response.status)
      }
    } catch (error) {
      console.error('Error fetching chat details:', error)
    }
  }

  const submitChat = async (chatId, message) => {
    try {
      console.log('Message being sent:', message) // logs the message before sending the request

      const token = await AsyncStorage.getItem('token')
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message`, {
        method: 'POST',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message // sends the message in the request body
        })
      })

      if (response.ok) {
        const data = await response.json()
        // console.log('Chat ID:', data.chat_id);
      } else {
        console.error('Failed to message chat:', response.status)
      }
    } catch (error) {
      console.error('Error messaging chat:', error)
    }
  }

  const editChat = async (chatId, messageId) => {
    try {
      console.log('Message edited to:', editedMessage) // logs the message before sending the request

      const token = await AsyncStorage.getItem('token')
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
        method: 'PATCH',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: editedMessage // sends the message in the request body
        })
      })

      if (response.ok) {
        const data = await response.json()
      } else {
        console.error('Failed to edit chat:', response.status)
      }
    } catch (error) {
      console.error('Error editing chat:', error)
    }
  }

  const deleteChat = async (chatId, messageId) => {
    try {
      const token = await AsyncStorage.getItem('token')
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Chat deleted')
      } else {
        console.error('Failed to delete chat:', response.status)
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setChatDetails(null)
  }

  const openEditModal = (item) => {
    setOriginalMessage(item.message)
    setEditedMessage(item.message)
    setEditModalVisible(true)
    setSelectedMessageId(item.message_id)
    console.log("Author's User ID:", item.author.user_id)
  }

  const closeEditModal = () => {
    setEditModalVisible(false)
  }


  const handleNewChatPress = () => {
    setShowNewChatModal(true)
  }

  const closeNewChatModal = () => {
    setShowNewChatModal(false)
  }

  const handleUpdateChatInformationModal = () => {
    setUpdateChatInformationModal(true)
  }

  const closeUpdateChatInformationModal = () => {
    setUpdateChatInformationModal(false)
  }

  const handleAddContact = () => {
    setAddContactsModalList(true)
    fetchContacts()
    setShowContactsModal(true)
  }

  const handleRemoveContact = () => {
    setRemoveContactsModalList(true)
    fetchContacts()
    setShowContactsModal(true)
  }

  const handleCloseContactListToAdd = () => {
    setAddContactsModalList(false)
    setRemoveContactsModalList(false)
    setShowContactsModal(false)
  }

  const handleSubmitMessage = () => {
    submitChat(selectedChat, messages)
    fetchChatDetails(selectedChat)
  }

  const handleEdit = () => {
    editChat(selectedChat, selectedMessageId) 
    fetchChatDetails(selectedChat)
    closeEditModal()
  }

  const handleDelete = () => {
    deleteChat(selectedChat, selectedMessageId)
    closeEditModal() 
    fetchChatDetails(selectedChat)
  }

  const handleUpdateChatInformation = (selectedChat) =>{
    updateChatInformation(selectedChat)
  };

  return (
    <View style={styles.container2}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleNewChatPress}>
          <Text style={styles.whiteText}>New Chat</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ maxHeight: 1000 }} contentContainerStyle={{ flexGrow: 1 }}>
        {chats.map((chat) => (
          <View key={chat.id}>
            <Text>{chat.name}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleChatSelection(chat.chat_id)}>
              <Text style={styles.whiteText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Modal visible={isModalVisible} animationType='slide'>
        <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUpdateChatInformationModal}>
          <Text style={styles.whiteText}>Change Chat Name</Text>
        </TouchableOpacity>
          <View style={styles.modalContent}>
            {/* Plus and Minus Icons */}
            <Ionicons
              name='remove-circle'
              size={24}
              color='blue'
              style={{ alignSelf: 'flex-end' }}
              onPress={handleRemoveContact}
            />
            <Ionicons
              name='add-circle'
              size={24}
              color='blue'
              style={{ alignSelf: 'flex-end' }}
              onPress={handleAddContact}
            />

            
            {chatDetails && (
              <View>
                <Text>{chatDetails.name}</Text>
                <Text>Members:</Text>
                <FlatList
                  data={chatDetails.members}
                  keyExtractor={(item) => item.user_id.toString()}
                  renderItem={({ item }) => (
                    <Text>
                      {item.first_name} {item.last_name}
                    </Text>
                  )}
                />
              </View>
            )}

            {/* Messages */}
            {chatDetails && (
              <ScrollView>
                {chatDetails.messages.map((message) => (
                  <TouchableOpacity
                    key={message.message_id}
                    onPress={() => {
                    // checks if the message is authored by the current user
                      if (message.author.user_id == userId) {
                        openEditModal(message) 
                      }
                    }}
                  >
                    <View style={[
                      styles.messageContainer,
                      message.author.user_id == userId ? styles.currentUserMessage : styles.otherUserMessage
                    ]}
                    >
                      <Text style={[
                        styles.clickableMessage,
                        message.author.user_id == userId ? styles.currentUserMessageText : styles.otherUserMessageText
                      ]}
                      >
                        {message.message}
                      </Text>
                      <Text style={styles.authorName}>
                        {message.author.first_name} {message.author.last_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            
            <TextInput
              style={styles.input1}
              placeholder='Enter your message'
              onChangeText={(text) => setMessages(text)}
            />
            <TouchableOpacity style={styles.button} onPress={() => handleSubmitMessage(selectedChat, messages)}>
              <Text style={styles.whiteText}>Submit</Text>
            </TouchableOpacity>

            
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text style={styles.whiteText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={showNewChatModal} animationType='slide'>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
           
            <View style={{ marginBottom: 10 }}>
             
              <TextInput
                style={styles.input1}
                placeholder='Enter chat name'
                onChangeText={(text) => setChatName(text)}
              />
            </View>
            <Text>Button Success!</Text>
            <TouchableOpacity style={styles.button} onPress={createChat}>
              <Text style={styles.whiteText}>Create Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeNewChatModal}>
              <Text style={styles.whiteText}>Closr</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showContactsModal} animationType='slide'>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.buttonContainer}>
              <Text>Contact List</Text>
              <ScrollView>
                {contacts.map((contact, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() => {
                        if (addContactsModalList) {
                          addUserToChat(selectedChat, contact.user_id)
                        } else if (removeContactsModalList) {
                          removeUserFromChat(selectedChat, contact.user_id)
                        }
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        
                        {contact.photo
                          ? (
                            <Image source={{ uri: `data:image/jpeg;base64,${contact.photo}` }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
                            )
                          : (
                            <Image source={require('../assets/icon.png')} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
                            )}
                        
                        <Text>{contact.first_name} {contact.last_name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.button} onPress={handleCloseContactListToAdd}>
                <Text style={styles.whiteText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={editModalVisible} animationType='slide'>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Edit Message</Text>
              <TextInput
                style={styles.input1}
                multiline
                value={editedMessage}
                onChangeText={setEditedMessage}
              />
              <TouchableOpacity style={styles.button} onPress={handleEdit}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleDelete}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={closeEditModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/*modal added for the changing of chatnames too*/}
      <Modal visible={updateChatInformationModal} animationType='slide'>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Edit Chat Name</Text>
              <TextInput
                style={styles.input1}
                multiline
                value={editedMessage}
                onChangeText={setEditedMessage}
              />
              <TouchableOpacity style={styles.button} onPress={handleUpdateChatInformation(selectedChat)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={closeUpdateChatInformationModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  )
}
