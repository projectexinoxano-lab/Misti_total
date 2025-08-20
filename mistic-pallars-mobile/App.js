import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// Import screens
import MapScreen from './src/screens/MapScreen';
import LlegendesScreen from './src/screens/LlegendesScreen';

const Tab = createBottomTabNavigator();

// Simple loading component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4caf50' }}>
    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>MISTIC PALLARS</Text>
    <Text style={{ color: 'white', fontSize: 14, marginTop: 10 }}>Carregant...</Text>
  </View>
);

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
  });

  // Show loading screen while fonts load
  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#4caf50" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Mapa') {
                iconName = focused ? 'map' : 'map-outline';
              } else if (route.name === 'Llegendes') {
                iconName = focused ? 'library' : 'library-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2e7d32',
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
              backgroundColor: '#4caf50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontFamily: 'Inter-Regular',
              fontWeight: 'bold',
              fontSize: 18,
            },
          })}
        >
          <Tab.Screen 
            name="Mapa" 
            component={MapScreen}
            options={{
              title: 'MISTIC PALLARS'
            }}
          />
          <Tab.Screen 
            name="Llegendes" 
            component={LlegendesScreen}
            options={{
              title: 'MISTIC PALLARS'
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
