import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../contexts/AuthContext'
import { apiService } from '../../services/supabase'

export default function ProfileScreen({ navigation }) {
  const { user, userProfile, signOut, updateProfile } = useAuth()
  const [puntuacions, setPuntuacions] = useState([])
  const [valoracions, setValoraciors] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState({ nom: '' })

  useEffect(() => {
    loadUserData()
  }, [user])

  useEffect(() => {
    if (userProfile) {
      setEditForm({ nom: userProfile.nom || '' })
    }
  }, [userProfile])

  const loadUserData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      const [puntuacionsData, valoracionsData] = await Promise.all([
        apiService.getPuntuacionsUsuari(user.id),
        apiService.getValoracionsUsuari(user.id)
      ])
      
      setPuntuacions(puntuacionsData)
      setValoraciors(valoracionsData)
    } catch (error) {
      console.error('Error carregant dades d\'usuari:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      await updateProfile({ nom: editForm.nom.trim() })
      setEditingProfile(false)
      Alert.alert('Èxit', 'Perfil actualitzat correctament')
    } catch (error) {
      console.error('Error actualitzant perfil:', error)
      Alert.alert('Error', 'No s\'ha pogut actualitzar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    Alert.alert(
      'Tancar Sessió',
      'Esteu segur que voleu tancar la sessió?',
      [
        { text: 'Cancel·lar', style: 'cancel' },
        { text: 'Tancar Sessió', style: 'destructive', onPress: signOut }
      ]
    )
  }

  const getProfileStats = () => {
    const totalPunts = userProfile?.puntuacio_total || 0
    const llegenddesVisitades = puntuacions.length
    const valoracioMitjana = valoracions.length > 0 
      ? (valoracions.reduce((sum, v) => sum + v.valoracio, 0) / valoracions.length).toFixed(1)
      : '0'
    
    return { totalPunts, llegenddesVisitades, valoracioMitjana }
  }

  const { totalPunts, llegenddesVisitades, valoracioMitjana } = getProfileStats()

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Ionicons name="person-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No has iniciat sessió</Text>
          <Text style={styles.emptyText}>
            Inicia sessió per veure el teu perfil i seguir el teu progrés
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Iniciar Sessió</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header del perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(userProfile?.nom || user.email)?.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          
          {editingProfile ? (
            <View style={styles.editForm}>
              <TextInput
                style={styles.editInput}
                value={editForm.nom}
                onChangeText={(text) => setEditForm({ nom: text })}
                placeholder="El teu nom"
                placeholderTextColor="#9CA3AF"
              />
              <View style={styles.editButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditingProfile(false)
                    setEditForm({ nom: userProfile?.nom || '' })
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel·lar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {userProfile?.nom || 'Usuari'}
              </Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setEditingProfile(true)}
              >
                <Ionicons name="create-outline" size={16} color="#3B82F6" />
                <Text style={styles.editButtonText}>Editar Perfil</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Estadístiques */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Les Meves Estadístiques</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="trophy" size={24} color="#F59E0B" />
              <Text style={styles.statValue}>{totalPunts}</Text>
              <Text style={styles.statLabel}>Punts Totals</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="map" size={24} color="#10B981" />
              <Text style={styles.statValue}>{llegenddesVisitades}</Text>
              <Text style={styles.statLabel}>Llegendes Visitades</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="star" size={24} color="#8B5CF6" />
              <Text style={styles.statValue}>{valoracioMitjana}</Text>
              <Text style={styles.statLabel}>Valoració Mitjana</Text>
            </View>
          </View>
        </View>

        {/* Activitat recent */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Activitat Recent</Text>
          
          {puntuacions.length > 0 ? (
            <View style={styles.activityList}>
              {puntuacions.slice(0, 5).map((puntuacio, index) => (
                <View key={puntuacio.id || index} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Ionicons name="trophy-outline" size={16} color="#3B82F6" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>
                      Has guanyat {puntuacio.punts} punts
                    </Text>
                    <Text style={styles.activityDate}>
                      {new Date(puntuacio.data_puntuacio).toLocaleDateString('ca-ES')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyActivity}>
              <Ionicons name="time-outline" size={32} color="#D1D5DB" />
              <Text style={styles.emptyActivityText}>
                Encara no tens activitat recent
              </Text>
            </View>
          )}
        </View>

        {/* Configuració */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Configuració</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color="#6B7280" />
              <Text style={styles.settingText}>Notificacions</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="location-outline" size={20} color="#6B7280" />
              <Text style={styles.settingText}>Privacitat i Ubicació</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
              <Text style={styles.settingText}>Ajuda i Suport</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
              <Text style={styles.settingText}>Sobre l'Aplicació</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* Botó de tancar sessió */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.signOutText}>Tancar Sessió</Text>
          </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 12,
    color: '#3B82F6',
    marginLeft: 4,
    fontWeight: '500',
  },
  editForm: {
    width: '100%',
    alignItems: 'center',
  },
  editInput: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  activityContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  activityList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  activityDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyActivityText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  settingsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  signOutContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    borderRadius: 8,
  },
  signOutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '500',
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  loginButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
})