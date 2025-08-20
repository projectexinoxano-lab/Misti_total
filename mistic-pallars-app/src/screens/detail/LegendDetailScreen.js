import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { Audio } from 'expo-av'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from '../../contexts/LocationContext'
import { apiService } from '../../services/supabase'

const { width } = Dimensions.get('window')

export default function LegendDetailScreen({ route, navigation }) {
  const { legend } = route.params
  const { user, userProfile } = useAuth()
  const { getDistanceToLocation } = useLocation()
  const [isFavorit, setIsFavorit] = useState(false)
  const [userValoracio, setUserValoracio] = useState(0)
  const [loading, setLoading] = useState(false)
  const [sound, setSound] = useState(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [hasEarnedPoints, setHasEarnedPoints] = useState(false)

  useEffect(() => {
    loadUserData()
    checkIfPointsEarned()
    
    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [user, legend])

  const loadUserData = async () => {
    if (!user) return

    try {
      // Comprovar si és favorit
      const favorits = await apiService.getFavorits(user.id)
      setIsFavorit(favorits.includes(legend.id))

      // Obtenir valoració de l'usuari
      const valoracions = await apiService.getValoracionsUsuari(user.id)
      const userVal = valoracions.find(v => v.llegenda_id === legend.id)
      if (userVal) {
        setUserValoracio(userVal.valoracio)
      }
    } catch (error) {
      console.error('Error carregant dades d\'usuari:', error)
    }
  }

  const checkIfPointsEarned = async () => {
    if (!user) return

    try {
      const puntuacions = await apiService.getPuntuacionsUsuari(user.id)
      const hasPoints = puntuacions.some(p => p.llegenda_id === legend.id)
      setHasEarnedPoints(hasPoints)
    } catch (error) {
      console.error('Error comprovant puntuacions:', error)
    }
  }

  const toggleFavorit = async () => {
    if (!user) {
      Alert.alert('Inicia Sessió', 'Has d\'iniciar sessió per afegir favorits')
      return
    }

    try {
      setLoading(true)
      const newStatus = await apiService.toggleFavorit(user.id, legend.id)
      setIsFavorit(newStatus)
    } catch (error) {
      console.error('Error canviant favorit:', error)
      Alert.alert('Error', 'No s\'ha pogut canviar l\'estat de favorit')
    } finally {
      setLoading(false)
    }
  }

  const setValoracio = async (valoracio) => {
    if (!user) {
      Alert.alert('Inicia Sessió', 'Has d\'iniciar sessió per valorar')
      return
    }

    try {
      setLoading(true)
      await apiService.setValoracio(user.id, legend.id, valoracio)
      setUserValoracio(valoracio)
    } catch (error) {
      console.error('Error establint valoració:', error)
      Alert.alert('Error', 'No s\'ha pogut guardar la valoració')
    } finally {
      setLoading(false)
    }
  }

  const earnPoints = async () => {
    if (!user || hasEarnedPoints) return

    try {
      setLoading(true)
      await apiService.addPuntuacio(user.id, legend.id, legend.punts_recompensa)
      setHasEarnedPoints(true)
      
      Alert.alert(
        'Punts Guanyats!',
        `Has guanyat ${legend.punts_recompensa} punts per llegir aquesta llegenda!`,
        [{ text: 'Genial!' }]
      )
    } catch (error) {
      console.error('Error guanyant punts:', error)
    } finally {
      setLoading(false)
    }
  }

  const playAudio = async () => {
    if (!legend.audio_url) {
      Alert.alert('Audio No Disponible', 'Aquesta llegenda no té narració d\'audio')
      return
    }

    try {
      if (isPlayingAudio && sound) {
        // Pausar audio
        await sound.pauseAsync()
        setIsPlayingAudio(false)
      } else if (sound) {
        // Continuar audio
        await sound.playAsync()
        setIsPlayingAudio(true)
      } else {
        // Carregar i reproduir audio
        const { sound: newSound } = await Audio.createAsync(
          { uri: legend.audio_url },
          { shouldPlay: true }
        )
        setSound(newSound)
        setIsPlayingAudio(true)
        
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlayingAudio(false)
          }
        })
      }
    } catch (error) {
      console.error('Error reproduint audio:', error)
      Alert.alert('Error', 'No s\'ha pogut reproduir l\'audio')
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

  const formatDistance = (distance) => {
    if (!distance) return ''
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  const distance = getDistanceToLocation(legend.latitud, legend.longitud)
  const categoryColor = getCategoryColor(legend.categoria)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Imatge de capçalera */}
        <View style={styles.imageContainer}>
          {legend.imatge_url ? (
            <Image source={{ uri: legend.imatge_url }} style={styles.headerImage} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: `${categoryColor}20` }]}>
              <Ionicons name="image-outline" size={48} color={categoryColor} />
            </View>
          )}
          
          {/* Botó favorit superposat */}
          <TouchableOpacity 
            style={styles.favoriteOverlay}
            onPress={toggleFavorit}
            disabled={loading}
          >
            <Ionicons 
              name={isFavorit ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorit ? "#EF4444" : "#ffffff"} 
            />
          </TouchableOpacity>
        </View>

        {/* Informació bàsica */}
        <View style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{legend.titol}</Text>
            <View style={styles.metaContainer}>
              <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {legend.categoria}
                </Text>
              </View>
              {distance && (
                <Text style={styles.distanceText}>{formatDistance(distance)}</Text>
              )}
            </View>
          </View>

          {/* Estadístiques */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.statText}>Dificultat {legend.dificultat}/5</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={16} color="#3B82F6" />
              <Text style={styles.statText}>{legend.punts_recompensa} punts</Text>
            </View>
          </View>

          {/* Botó d'audio */}
          {legend.audio_url && (
            <TouchableOpacity style={styles.audioButton} onPress={playAudio}>
              <Ionicons 
                name={isPlayingAudio ? "pause" : "play"} 
                size={20} 
                color="#ffffff" 
              />
              <Text style={styles.audioButtonText}>
                {isPlayingAudio ? 'Pausar Narració' : 'Escoltar Narració'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Descripció */}
          {legend.descripcio_curta && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Resum</Text>
              <Text style={styles.description}>{legend.descripcio_curta}</Text>
            </View>
          )}

          {/* Text complet */}
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>La Llegenda</Text>
            <Text style={styles.content}>{legend.text_complet}</Text>
          </View>

          {/* Botó per guanyar punts */}
          {user && !hasEarnedPoints && (
            <TouchableOpacity 
              style={styles.pointsButton}
              onPress={earnPoints}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="trophy" size={20} color="#ffffff" />
                  <Text style={styles.pointsButtonText}>
                    Guanyar {legend.punts_recompensa} Punts
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {hasEarnedPoints && (
            <View style={styles.pointsEarned}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.pointsEarnedText}>
                Ja has guanyat els punts d'aquesta llegenda
              </Text>
            </View>
          )}

          {/* Valoració */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingTitle}>Valora aquesta llegenda</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setValoracio(star)}
                  disabled={loading}
                >
                  <Ionicons
                    name={star <= userValoracio ? "star" : "star-outline"}
                    size={32}
                    color={star <= userValoracio ? "#F59E0B" : "#D1D5DB"}
                    style={styles.star}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {userValoracio > 0 && (
              <Text style={styles.ratingText}>
                Has valorat aquesta llegenda amb {userValoracio} estrella{userValoracio !== 1 ? 's' : ''}
              </Text>
            )}
          </View>

          {/* Mapa de ubicació */}
          <View style={styles.mapContainer}>
            <Text style={styles.mapTitle}>Ubicació</Text>
            <View style={styles.mapWrapper}>
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: legend.latitud,
                  longitude: legend.longitud,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                mapType="terrain"
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: legend.latitud,
                    longitude: legend.longitud,
                  }}
                  title={legend.titol}
                  pinColor={categoryColor}
                />
              </MapView>
            </View>
            <Text style={styles.coordinates}>
              {legend.latitud.toFixed(6)}, {legend.longitud.toFixed(6)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 240,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 32,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  distanceText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  audioButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  contentContainer: {
    marginBottom: 24,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
    textAlign: 'justify',
  },
  pointsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  pointsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  pointsEarned: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  pointsEarnedText: {
    fontSize: 14,
    color: '#10B981',
    marginLeft: 8,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  mapContainer: {
    marginBottom: 20,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  mapWrapper: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  coordinates: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
})