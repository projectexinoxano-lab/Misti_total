import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const MapaScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 42.6026,
    longitude: 1.1375,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  });

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permís de localització denegat');
        Alert.alert(
          'Permís necessari',
          'Aquesta aplicació necessita accés a la ubicació per mostrar la vostra posició al mapa.',
          [{ text: 'D\'acord' }]
        );
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      
      setLocation(currentLocation);
      
      // Actualitzar la regió del mapa per centrar-lo a la posició actual
      setMapRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      setErrorMsg('Error obtenint la localització');
      console.log('Error:', error);
    }
  };

  const centerOnUser = () => {
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      getLocationAsync();
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        mapType="hybrid"
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="La meva ubicació"
            description="Estàs aquí"
          />
        )}
        
        {/* Marcadors de llocs místics dels Pallars */}
        <Marker
          coordinate={{ latitude: 42.6026, longitude: 1.1375 }}
          title="Sort"
          description="Castell de Sort - La Dama Blanca"
        />
        <Marker
          coordinate={{ latitude: 42.5540, longitude: 0.9876 }}
          title="Estany de Sant Maurici"
          description="Els Encantats"
        />
        <Marker
          coordinate={{ latitude: 42.6423, longitude: 1.0845 }}
          title="Vall d'Àneu"
          description="Llegenda del Comte Arnau"
        />
      </MapView>
      
      <TouchableOpacity style={styles.centerButton} onPress={centerOnUser}>
        <Ionicons name="locate" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centerButton: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    backgroundColor: '#2D5016',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default MapaScreen;
