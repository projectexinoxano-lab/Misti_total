import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, apiService } from '../services/supabase'
// AsyncStorage no és necessari per la funcionalitat bàsica

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verificar si hi ha una sessió existent
    checkUser()

    // Escoltar canvis d'autenticació
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
          await loadUserProfile(session.user.id)
        } else {
          setUser(null)
          setUserProfile(null)
          setIsAuthenticated(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (currentUser) {
        setUser(currentUser)
        setIsAuthenticated(true)
        await loadUserProfile(currentUser.id)
      }
    } catch (error) {
      console.error('Error verificant usuari:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async (userId) => {
    try {
      let profile = await apiService.getUserProfile(userId)
      
      // Si no existeix el perfil, crear-lo
      if (!profile && user) {
        profile = await apiService.createUserProfile(user)
      }
      
      setUserProfile(profile)
    } catch (error) {
      console.error('Error carregant perfil d\'usuari:', error)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) throw error
      return data
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      // Netejar dades locals si cal
      setUser(null)
      setUserProfile(null)
      setIsAuthenticated(false)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No hi ha usuari autenticat')
      
      const updatedProfile = await apiService.updateUserProfile(user.id, updates)
      setUserProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
    loadUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}