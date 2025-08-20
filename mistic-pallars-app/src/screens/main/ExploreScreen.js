import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from '../../contexts/LocationContext'
import { apiService } from '../../services/supabase'

const categories = [
  { name: 'Totes', icon: 'apps-outline' },
  { name: 'Fades i éssers màgics', icon: 'sparkles-outline' },
  { name: 'Tresors ocults', icon: 'diamond-outline' },
  { name: 'Bruixes i curanderes', icon: 'moon-outline' },
  { name: 'Dracs i monstres', icon: 'flame-outline' },
  { name: 'Esperits i fantasmes', icon: 'eye-outline' },
  { name: 'Llegendes històriques', icon: 'library-outline' },
]

export default function ExploreScreen({ navigation }) {
  const { userProfile } = useAuth()
  const { location, getDistanceToLocation } = useLocation()
  const [llegendes, setLlegendes] = useState([])
  const [filteredLlegendes, setFilteredLlegendes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Totes')
  const [favorits, setFavorits] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterLlegendes()
  }, [llegendes, searchText, selectedCategory])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Carregar llegendes i favorits en paral·lel
      const [legendsData, favoritsData] = await Promise.all([
        apiService.getLlegendes(),
        userProfile ? apiService.getFavorits(userProfile.id) : []
      ])
      
      setLlegendes(legendsData)
      setFavorits(favoritsData)
    } catch (error) {
      console.error('Error carregant dades:', error)
      Alert.alert('Error', 'No s\'han pogut carregar les dades')
    } finally {
      setLoading(false)
    }
  }

  const filterLlegendes = () => {
    let filtered = llegendes

    // Filtrar per categoria
    if (selectedCategory !== 'Totes') {
      filtered = filtered.filter(llegenda => llegenda.categoria === selectedCategory)
    }

    // Filtrar per text de cerca
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(llegenda => 
        llegenda.titol.toLowerCase().includes(searchLower) ||
        llegenda.descripcio_curta?.toLowerCase().includes(searchLower) ||
        llegenda.categoria?.toLowerCase().includes(searchLower)
      )
    }

    // Ordenar per distància si tenim ubicació
    if (location && !location.isDefault) {
      filtered = filtered.map(llegenda => ({
        ...llegenda,
        distance: getDistanceToLocation(llegenda.latitud, llegenda.longitud)
      })).sort((a, b) => (a.distance || 999) - (b.distance || 999))
    }

    setFilteredLlegendes(filtered)
  }

  const toggleFavorit = async (llegendaId) => {
    if (!userProfile) return

    try {
      const isFavorit = await apiService.toggleFavorit(userProfile.id, llegendaId)
      
      if (isFavorit) {
        setFavorits(prev => [...prev, llegendaId])
      } else {
        setFavorits(prev => prev.filter(id => id !== llegendaId))
      }
    } catch (error) {
      console.error('Error canviant favorit:', error)
      Alert.alert('Error', 'No s\'ha pogut canviar l\'estat de favorit')
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

  const renderLlegenda = ({ item }) => {
    const isFavorit = favorits.includes(item.id)
    const categoryColor = getCategoryColor(item.categoria)

    return (
      <TouchableOpacity 
        style={styles.legendCard}
        onPress={() => navigation.navigate('LegendDetail', { legend: item })}
      >
        <View style={styles.legendContent}>
          <View style={styles.legendHeader}>
            <View style={styles.legendTitleContainer}>
              <Text style={styles.legendTitle} numberOfLines={2}>{item.titol}</Text>
              <View style={styles.legendMeta}>
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
              style={styles.favoriteButton}
              onPress={() => toggleFavorit(item.id)}
            >
              <Ionicons 
                name={isFavorit ? "heart" : "heart-outline"} 
                size={20} 
                color={isFavorit ? "#EF4444" : "#6B7280"} 
              />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.legendDescription} numberOfLines={3}>
            {item.descripcio_curta}
          </Text>
          
          <View style={styles.legendFooter}>
            <View style={styles.legendStats}>
              <View style={styles.statItem}>
                <Ionicons name="star-outline" size={14} color="#F59E0B" />
                <Text style={styles.statText}>Dificultat {item.dificultat}/5</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trophy-outline" size={14} color="#3B82F6" />
                <Text style={styles.statText}>{item.punts_recompensa} punts</Text>
              </View>
            </View>
            
            <View style={styles.legendActions}>
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderCategory = ({ item }) => {
    const isSelected = selectedCategory === item.name
    
    return (
      <TouchableOpacity 
        style={[styles.categoryButton, isSelected && styles.categoryButtonSelected]}
        onPress={() => setSelectedCategory(item.name)}
      >
        <Ionicons 
          name={item.icon} 
          size={16} 
          color={isSelected ? "#ffffff" : "#6B7280"} 
        />
        <Text style={[styles.categoryButtonText, isSelected && styles.categoryButtonTextSelected]}>
          {item.name === 'Totes' ? 'Totes' : item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorar Llegendes</Text>
        <Text style={styles.headerSubtitle}>
          {filteredLlegendes.length} llegend{filteredLlegendes.length !== 1 ? 'es' : 'a'}
        </Text>
      </View>

      {/* Barra de cerca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cerca llegendes..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchText('')}
            >
              <Ionicons name="close" size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Llista de llegendes */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Carregant llegendes...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredLlegendes}
          renderItem={renderLlegenda}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.legendsList}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadData}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>Cap llegenda trobada</Text>
              <Text style={styles.emptyText}>
                {searchText || selectedCategory !== 'Totes' 
                  ? 'Prova a canviar els filtres de cerca'
                  : 'No hi ha llegendes disponibles'}
              </Text>
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#1F2937',
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#3B82F6',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: '#ffffff',
  },
  legendsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  legendCard: {
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
  legendContent: {
    padding: 16,
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  legendTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  legendMeta: {
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
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  legendFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendStats: {
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
  legendActions: {
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
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
})