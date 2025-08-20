import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import MapaScreen from '../screens/MapaScreen';
import LlegendesScreen from '../screens/LlegendesScreen';
import FontsScreen from '../screens/FontsScreen';

const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Mapa') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Llegendes') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Fonts') {
              iconName = focused ? 'water' : 'water-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2D5016',
          tabBarInactiveTintColor: '#8B6914',
          tabBarStyle: {
            backgroundColor: '#F5F3F0',
            borderTopColor: '#E5E1DC',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#2D5016',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#F5F3F0',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        })}
      >
        <Tab.Screen 
          name="Mapa" 
          component={MapaScreen}
          options={{
            headerTitle: 'MISTIC-PALLARS',
          }}
        />
        <Tab.Screen 
          name="Llegendes" 
          component={LlegendesScreen}
          options={{
            headerTitle: 'LLEGENDES',
          }}
        />
        <Tab.Screen 
          name="Fonts" 
          component={FontsScreen}
          options={{
            headerTitle: 'FONTS',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
