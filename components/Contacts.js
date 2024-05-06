import React, { useState, useEffect } from 'react'
import { Text, View, Image, ScrollView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { contactBoxWidth } from './styles'//needed to import separately otherwise caused issue for unknown reason
import styles from './styles'
import noProfileImage from '../assets/profpic.jpeg'//the default profile pic before one gets set

export default function Chat () {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
//fetches all contacts upon entering the component
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        const response = await fetch('http://localhost:3333/api/1.0.0/contacts', {
          headers: {
            'X-Authorization': token,
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()

        // etch profile pictures for each contact. similar to settings but slightly different as theres many contacts to render images for
        const contactsWithImages = await Promise.all(data.map(async (contact) => {
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
              // setting default image for users that dont have an image response
              setContacts(prevContacts => [...prevContacts, { ...contact, photo: noProfileImage }])
            }
          } catch (error) {
            console.error('Error fetching photo:', error)
          }
        }))

        setLoading(false)
      } catch (error) {
        console.error('Error fetching contacts:', error)
      }
    }

    fetchContacts()
  }, [])

  return (
    <View style={styles.container3}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          <Text>Contacts:</Text>
          <ScrollView style={{ maxHeight: 500 }}>
            <View>
              {contacts.map((contact, index) => (
                <View key={index} style={[styles.contactBox, { width: contactBoxWidth }]}>
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${contact.photo}` }}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                  />
                  <Text>{contact.first_name} {contact.last_name}</Text>
                  <Text>Email: {contact.email}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  )
}
