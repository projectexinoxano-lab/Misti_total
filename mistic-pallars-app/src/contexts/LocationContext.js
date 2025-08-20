import React, { createContext, useContext, useEffect, useState } from 'react'
import * as Location from 'expo-location'
import { Alert } from 'react-native'

const LocationContext = createContext({})

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    requestLocationPermission()
  }, [])

  const requestLocationPermission = async () => {
    try {
      setLoading(true)
      setError(null)

      // Sol·licitar permisos de localització
      const { status } = await Location.requestForegroundPermissionsAsync()
      
      if (status !== 'granted') {
        setError('Permisos de localització denegats')
        setHasPermission(false)
        Alert.alert(
          'Permisos de Localització',
          'Per descobrir les llegendes properes, necessitem accés a la teva ubicació. Pots activar-ho a la configuració de l\'aplicació.',
          [{ text: 'D\'acord' }]
        )
        return
      }

      setHasPermission(true)
      await getCurrentLocation()
    } catch (error) {
      console.error('Error sol·licitant permisos:', error)
      setError('Error sol·licitant permisos de localització')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = async () => {
    try {
      setLoading(true)
      setError(null)

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
        maximumAge: 60000, // Usar ubicació caché de fins a 1 minut
      })

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
        timestamp: currentLocation.timestamp,
      })
    } catch (error) {
      console.error('Error obtenint ubicació:', error)
      setError('Error obtenint la ubicació actual')
      
      // Ubicació per defecte al Pallars si no es pot obtenir la ubicació
      setLocation({
        latitude: 42.5680,
        longitude: 0.9970,
        accuracy: null,
        timestamp: Date.now(),
        isDefault: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshLocation = async () => {
    if (!hasPermission) {
      await requestLocationPermission()
      return
    }
    
    await getCurrentLocation()
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radi de la Terra en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    return distance
  }

  const getDistanceToLocation = (targetLatitude, targetLongitude) => {
    if (!location) return null
    
    return calculateDistance(
      location.latitude,
      location.longitude,
      targetLatitude,
      targetLongitude
    )
  }

  const value = {
    location,
    loading,
    error,
    hasPermission,
    requestLocationPermission,
    getCurrentLocation,
    refreshLocation,
    getDistanceToLocation,
    calculateDistance,
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}