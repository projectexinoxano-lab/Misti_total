import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from './src/contexts/AuthContext'
import { LocationProvider } from './src/contexts/LocationContext'
import AppNavigator from './src/navigation/AppNavigator'
import { LogBox } from 'react-native'

// Desactivar warnings no crítics
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
])

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </LocationProvider>
    </AuthProvider>
  )
}