import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

// Contexts
import { useAuth } from '../contexts/AuthContext'

// Pantalles d'autenticació
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'

// Pantalles principals
import HomeScreen from '../screens/main/HomeScreen'
import ExploreScreen from '../screens/main/ExploreScreen'
import FavoritsScreen from '../screens/main/FavoritsScreen'
import ProfileScreen from '../screens/main/ProfileScreen'

// Pantalles de detall
import LegendDetailScreen from '../screens/detail/LegendDetailScreen'
import LoadingScreen from '../screens/LoadingScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

// Navegació d'autenticació
function AuthNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#ffffff' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}

// Navegació principal amb tabs
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Home') {
            iconName = focused ? 'map' : 'map-outline'
          } else if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline'
          } else if (route.name === 'Favorits') {
            iconName = focused ? 'heart' : 'heart-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Mapa' }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen} 
        options={{ tabBarLabel: 'Explorar' }}
      />
      <Tab.Screen 
        name="Favorits" 
        component={FavoritsScreen} 
        options={{ tabBarLabel: 'Favorits' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  )
}

// Navegació principal amb stack
function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3B82F6',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="LegendDetail" 
        component={LegendDetailScreen}
        options={({ route }) => ({
          title: route.params?.legend?.titol || 'Detall de la Llegenda',
          headerBackTitle: 'Enrere',
        })}
      />
    </Stack.Navigator>
  )
}

// Navegador principal de l'app
export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />
}