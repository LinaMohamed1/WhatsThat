import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider as PaperProvider } from 'react-native-paper'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Settings from './components/Settings'
import Chat from './components/Chat'
import Contacts from './components/Contacts'
import styles from './components/styles'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
//note: all components have 'isdarkmode' but didnt implement 
export default function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(false)//starts logged out and redirects to login page
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name='Login'>
              {(props) => <Login {...props} onLogin={handleLogin} />}
            </Stack.Screen>
            <Stack.Screen name='Register' component={Register} />
          </>
        ) : (
          <>
            <Stack.Screen name='Main' options={{ headerShown: false }}>
              {() => (
                <Tab.Navigator
                  screenOptions={{
                    tabBarStyle: { backgroundColor: '#EAFAF1' } // background color for the tab navigator
                  }}
                >
                  <Tab.Screen name='Home'>
                    {(props) => <Home {...props} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
                  </Tab.Screen>
                  <Tab.Screen name='Chat'>
                    {(props) => <Chat {...props} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
                  </Tab.Screen>
                  <Tab.Screen name='Contacts'>
                    {(props) => <Contacts {...props} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
                  </Tab.Screen>
                  <Tab.Screen name='Settings'>
                    {(props) => <Settings {...props} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
                  </Tab.Screen>
                </Tab.Navigator>
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
