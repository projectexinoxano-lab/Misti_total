import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import { useLocation } from '../../contexts/LocationContext'
import { useAuth } from '../../contexts/AuthContext'
import { apiService } from '../../services/supabase'

const { width, height } = Dimensions.get('window')

export default function HomeScreen({ navigation }) {
  const { location, loading: locationLoading, refreshLocation, hasPermission } = useLocation()
  const { userProfile } = useAuth()
  const [llegendes, setLlegendes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLlegenda, setSelectedLlegenda] = useState(null)
  const mapRef = useRef(null)

  useEffect(() => {
    loadLlegendes()
  }, [location])

  const loadLlegendes = async () => {
    try {
      setLoading(true)
      
      let legends = []
      if (location && hasPermission && !location.isDefault) {
        // Obtenir llegendes properes si tenim ubicació
        legends = await apiService.getLlegendesByProximity(
          location.latitude,
          location.longitude,
          20 // 20km de radi
        )
      } else {
        // Obtenir totes les llegendes si no tenim ubicació
        legends = await apiService.getLlegendes()
      }
      
      setLlegendes(legends)
    } catch (error) {
      console.error('Error carregant llegendes:', error)
      Alert.alert('Error', 'No s\'han pogut carregar les llegendes')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkerPress = (llegenda) => {
    setSelectedLlegenda(llegenda)
    
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: llegenda.latitud,
        longitude: llegenda.longitud,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000)
    }
  }

  const handleLocationPress = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Permisos de Localització',
        'Per usar aquesta funció necessitem accés a la teva ubicació.',
        [
          { text: 'Cancel·lar', style: 'cancel' },
          { text: 'Configuració', onPress: () => {} }
        ]
      )
      return
    }

    await refreshLocation()
    
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000)
    }
  }

  const getCategoryColor = (categoria) => {
    const colors = {
      'Fades i éssers màgics': '#8B5CF6',
      'Tresors ocults': '#F59E0B',
      'Bruixes i curanderes': '#EC4899',
      'Dracs i monstres': '#EF4444',
      'Esperits i fantasmes': '#6B7280',
      'Llegendes històriques': '#10B981',
    }
    return colors[categoria] || '#3B82F6'
  }

  const mapRegion = location ? {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: location.isDefault ? 0.3 : 0.1,
    longitudeDelta: location.isDefault ? 0.3 : 0.1,
  } : {
    // Regió per defecte del Pallars
    latitude: 42.5680,
    longitude: 0.9970,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Hola{userProfile?.nom ? `, ${userProfile.nom}` : ''}!</Text>
            <Text style={styles.locationText}>
              {location && !location.isDefault ? 'Llegendes properes' : 'Totes les llegendes'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.pointsText}>{userProfile?.puntuacio_total || 0} punts</Text>
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={handleLocationPress}
            >
              <Ionicons 
                name={hasPermission ? "location" : "location-outline"} 
                size={20} 
                color={hasPermission ? "#3B82F6" : "#6B7280"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Mapa */}
      <View style={styles.mapContainer}>
        {locationLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Carregant mapa...</Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={mapRegion}
            showsUserLocation={hasPermission}
            showsMyLocationButton={false}
            mapType="terrain"
          >
            {llegendes.map((llegenda) => (
              <Marker
                key={llegenda.id}
                coordinate={{
                  latitude: llegenda.latitud,
                  longitude: llegenda.longitud,
                }}
                title={llegenda.titol}
                description={llegenda.descripcio_curta}
                pinColor={getCategoryColor(llegenda.categoria)}
                onPress={() => handleMarkerPress(llegenda)}
              />
            ))}
          </MapView>
        )}

        {/* Botó de refresh */}
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadLlegendes}
          disabled={loading}
        >
          <Ionicons 
            name="refresh" 
            size={20} 
            color="#3B82F6" 
          />
        </TouchableOpacity>
      </View>

      {/* Informació de la llegenda seleccionada */}
      {selectedLlegenda && (
        <View style={styles.legendInfo}>
          <View style={styles.legendHeader}>
            <View style={styles.legendTitleContainer}>
              <Text style={styles.legendTitle}>{selectedLlegenda.titol}</Text>
              <Text style={styles.legendCategory}>{selectedLlegenda.categoria}</Text>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedLlegenda(null)}
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.legendDescription} numberOfLines={2}>
            {selectedLlegenda.descripcio_curta}
          </Text>
          
          <View style={styles.legendActions}>
            <View style={styles.legendStats}>
              <Text style={styles.legendDifficulty}>
                Dificultat: {selectedLlegenda.dificultat}/5
              </Text>
              <Text style={styles.legendPoints}>
                {selectedLlegenda.punts_recompensa} punts
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.detailButton}
              onPress={() => navigation.navigate('LegendDetail', { legend: selectedLlegenda })}
            >
              <Text style={styles.detailButtonText}>Veure Detall</Text>
              <Ionicons name="chevron-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Indicador de càrrega */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text style={styles.loadingOverlayText}>Carregant llegendes...</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginRight: 12,
  },
  locationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: width,
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  refreshButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  legendInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  legendTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  legendCategory: {
    fontSize: 12,
    color: '#6B7280',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  legendActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendStats: {
    flex: 1,
  },
  legendDifficulty: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  legendPoints: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingOverlayText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
})