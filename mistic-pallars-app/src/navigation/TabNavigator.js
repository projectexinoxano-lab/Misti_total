// Navegador de pestanyes inferiors
// Data: 2025-08-13

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { LlegendesScreen } from '../screens/LlegendesScreen';
import { MapScreen } from '../screens/MapScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../utils/theme';

const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Llegendes':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Mapa':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Perfil':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray[200],
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: colors.primary[500],
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Inici',
          headerTitle: 'Mistic Pallars'
        }}
      />
      <Tab.Screen 
        name="Llegendes" 
        component={LlegendesScreen}
        options={{
          title: 'Llegendes',
          headerTitle: 'Llegendes del Pallars'
        }}
      />
      <Tab.Screen 
        name="Mapa" 
        component={MapScreen}
        options={{
          title: 'Mapa',
          headerTitle: 'Mapa de Llegendes'
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          headerTitle: 'El meu Perfil'
        }}
      />
    </Tab.Navigator>
  );
}