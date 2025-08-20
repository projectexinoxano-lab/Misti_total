import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from '../../contexts/LocationContext'
import { apiService } from '../../services/supabase'

export default function FavoritsScreen({ navigation }) {
  const { userProfile } = useAuth()
  const { getDistanceToLocation } = useLocation()
  const [favorits, setFavorits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorits()
  }, [])

  const loadFavorits = async () => {
    if (!userProfile) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Obtenir IDs dels favorits
      const favoritIds = await apiService.getFavorits(userProfile.id)
      
      if (favoritIds.length === 0) {
        setFavorits([])
        return
      }
      
      // Obtenir detalls de les llegendes favorites
      const todasLlegendes = await apiService.getLlegendes()
      const llegenddesFavorites = todasLlegendes.filter(llegenda => 
        favoritIds.includes(llegenda.id)
      )
      
      // Afegir distància si tenim ubicació
      const llegenddesWithDistance = llegenddesFavorites.map(llegenda => ({
        ...llegenda,
        distance: getDistanceToLocation(llegenda.latitud, llegenda.longitud)
      })).sort((a, b) => (a.distance || 999) - (b.distance || 999))
      
      setFavorits(llegenddesWithDistance)
    } catch (error) {
      console.error('Error carregant favorits:', error)
      Alert.alert('Error', 'No s\'han pogut carregar els favorits')
    } finally {
      setLoading(false)
    }
  }

  const removeFavorit = async (llegendaId) => {
    if (!userProfile) return

    try {
      await apiService.toggleFavorit(userProfile.id, llegendaId)
      setFavorits(prev => prev.filter(llegenda => llegenda.id !== llegendaId))
    } catch (error) {
      console.error('Error eliminant favorit:', error)
      Alert.alert('Error', 'No s\'ha pogut eliminar el favorit')
    }
  }

  const formatDistance = (distance) => {
    if (!distance) return ''
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
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

  const renderFavorit = ({ item }) => {
    const categoryColor = getCategoryColor(item.categoria)

    return (
      <TouchableOpacity 
        style={styles.favoritCard}
        onPress={() => navigation.navigate('LegendDetail', { legend: item })}
      >
        <View style={styles.favoritContent}>
          <View style={styles.favoritHeader}>
            <View style={styles.favoritTitleContainer}>
              <Text style={styles.favoritTitle} numberOfLines={2}>{item.titol}</Text>
              <View style={styles.favoritMeta}>
                <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
                  <Text style={[styles.categoryText, { color: categoryColor }]}>
                    {item.categoria}
                  </Text>
                </View>
                {item.distance && (
                  <Text style={styles.distanceText}>{formatDistance(item.distance)}</Text>
                )}
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => {
                Alert.alert(
                  'Eliminar Favorit',
                  `Vols eliminar "${item.titol}" dels teus favorits?`,
                  [
                    { text: 'Cancel·lar', style: 'cancel' },
                    { text: 'Eliminar', style: 'destructive', onPress: () => removeFavorit(item.id) }
                  ]
                )
              }}
            >
              <Ionicons name="heart" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.favoritDescription} numberOfLines={3}>
            {item.descripcio_curta}
          </Text>
          
          <View style={styles.favoritFooter}>
            <View style={styles.favoritStats}>
              <View style={styles.statItem}>
                <Ionicons name="star-outline" size={14} color="#F59E0B" />
                <Text style={styles.statText}>Dificultat {item.dificultat}/5</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trophy-outline" size={14} color="#3B82F6" />
                <Text style={styles.statText}>{item.punts_recompensa} punts</Text>
              </View>
            </View>
            
            <View style={styles.favoritActions}>
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Inicia sessió</Text>
          <Text style={styles.emptyText}>
            Per veure els teus favorits has d'iniciar sessió
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Els Meus Favorits</Text>
        <Text style={styles.headerSubtitle}>
          {favorits.length} llegend{favorits.length !== 1 ? 'es' : 'a'} guardada{favorits.length !== 1 ? 'es' : ''}
        </Text>
      </View>

      {/* Contingut */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Carregant favorits...</Text>
        </View>
      ) : (
        <FlatList
          data={favorits}
          renderItem={renderFavorit}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.favoritsList}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadFavorits}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>Encara no tens favorits</Text>
              <Text style={styles.emptyText}>
                Explora les llegendes i marca les que més t'agradin com a favorites
              </Text>
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => navigation.navigate('Explore')}
              >
                <Text style={styles.exploreButtonText}>Explorar Llegendes</Text>
              </TouchableOpacity>
            </View>
          }
        />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  favoritsList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  favoritCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  favoritContent: {
    padding: 16,
  },
  favoritHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  favoritTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  favoritTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  favoritMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  distanceText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoritDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  favoritFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoritStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  favoritActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
})