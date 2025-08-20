import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Constants from 'expo-constants';

const MapScreen = () => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 42.6384,  // Coordinates for Pallars region
    longitude: 0.8888,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  // Get Google Maps API key
  const googleMapsApiKey = Constants.expoConfig?.extra?.googleMapsApiKey || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Use Google provider only if API key is available
  const mapProvider = googleMapsApiKey ? PROVIDER_GOOGLE : undefined;

  // Sample data - completely static, no backend dependency
  const sampleMarkers = [
    {
      id: 1,
      coordinate: { latitude: 42.6384, longitude: 0.8888 },
      title: "Llegenda del Llac de la Torrassa",
      description: "Aigües misterioses del Pallars"
    },
    {
      id: 2,
      coordinate: { latitude: 42.6500, longitude: 0.9000 },
      title: "El Tresor dels Bandolers",
      description: "Antics bandolers de les muntanyes"
    },
    {
      id: 3,
      coordinate: { latitude: 42.6200, longitude: 0.8700 },
      title: "Els Esperits del Bosc",
      description: "Guardians sobrenaturals del territori"
    }
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        provider={mapProvider}
        showsUserLocation={false} // No location permission needed
        showsMyLocationButton={false} // No location permission needed
      >
        {/* Static markers - no backend required */}
        {sampleMarkers.map((marker) => (
          <MapView.Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
      <View style={styles.info}>
        <Text style={styles.infoText}>Mapa del Pallars - Llegendes i Mites</Text>
        <Text style={styles.subText}>Descobreix les històries del territori</Text>
        <Text style={styles.countText}>{sampleMarkers.length} llegendes disponibles</Text>
      </View>
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
  info: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  countText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 3,
  },
});

export default MapScreen;
