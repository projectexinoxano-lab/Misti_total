import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipus de dades per TypeScript
export interface Usuari {
  id: string
  email: string
  nom: string | null
  avatar_url: string | null
  puntuacio_total: number
  data_creacio: string
  ultima_connexio: string
}

export interface Llegenda {
  id: string
  titol: string
  descripcio_curta: string | null
  text_complet: string
  latitud: number
  longitud: number
  imatge_url: string | null
  audio_url: string | null
  categoria: string | null
  dificultat: number
  punts_recompensa: number
  es_actiu: boolean
  data_creacio: string
  data_actualitzacio: string
}

export interface Puntuacio {
  id: string
  usuari_id: string
  llegenda_id: string
  punts: number
  data_puntuacio: string
}

export interface Favorit {
  id: string
  usuari_id: string
  llegenda_id: string
  data_favorit: string
}

export interface Valoracio {
  id: string
  usuari_id: string
  llegenda_id: string
  valoracio: number
  comentari: string | null
  data_valoracio: string
}

// Funcions d'API
export const apiService = {
  // Usuaris
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async getUserProfile(userId: string): Promise<Usuari | null> {
    const { data, error } = await supabase
      .from('usuaris')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    
    if (error) throw error
    return data
  },

  async updateUserProfile(userId: string, updates: Partial<Usuari>) {
    const { data, error } = await supabase
      .from('usuaris')
      .update({
        ...updates,
        ultima_connexio: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .maybeSingle()
    
    if (error) throw error
    return data
  },

  async createUserProfile(user: any) {
    const { data, error } = await supabase
      .from('usuaris')
      .insert({
        id: user.id,
        email: user.email,
        nom: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        puntuacio_total: 0,
      })
      .select()
      .maybeSingle()
    
    if (error) throw error
    return data
  },

  // Llegendes
  async getLlegendes(): Promise<Llegenda[]> {
    const { data, error } = await supabase
      .from('llegendes')
      .select('*')
      .eq('es_actiu', true)
      .order('data_creacio', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getLlegendaById(id: string): Promise<Llegenda | null> {
    const { data, error } = await supabase
      .from('llegendes')
      .select('*')
      .eq('id', id)
      .eq('es_actiu', true)
      .maybeSingle()
    
    if (error) throw error
    return data
  },

  async getLlegendesByProximity(lat: number, lng: number, radius: number = 10) {
    const { data, error } = await supabase
      .rpc('obtenir_llegendes_properes', {
        lat_usuari: lat,
        lng_usuari: lng,
        radi_km: radius
      })
    
    if (error) throw error
    return data || []
  },

  // Favorits
  async getFavorits(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('favorits')
      .select('llegenda_id')
      .eq('usuari_id', userId)
    
    if (error) throw error
    return (data || []).map(f => f.llegenda_id)
  },

  async toggleFavorit(userId: string, llegendaId: string) {
    // Comprovar si ja és favorit
    const { data: existing } = await supabase
      .from('favorits')
      .select('id')
      .eq('usuari_id', userId)
      .eq('llegenda_id', llegendaId)
      .maybeSingle()
    
    if (existing) {
      // Eliminar favorit
      const { error } = await supabase
        .from('favorits')
        .delete()
        .eq('id', existing.id)
      
      if (error) throw error
      return false
    } else {
      // Afegir favorit
      const { error } = await supabase
        .from('favorits')
        .insert({
          usuari_id: userId,
          llegenda_id: llegendaId,
        })
      
      if (error) throw error
      return true
    }
  },

  // Valoracions
  async getValoracionsUsuari(userId: string) {
    const { data, error } = await supabase
      .from('valoracions')
      .select('*')
      .eq('usuari_id', userId)
    
    if (error) throw error
    return data || []
  },

  async setValoracio(userId: string, llegendaId: string, valoracio: number, comentari?: string) {
    const { data, error } = await supabase
      .from('valoracions')
      .upsert({
        usuari_id: userId,
        llegenda_id: llegendaId,
        valoracio,
        comentari: comentari || null,
        data_valoracio: new Date().toISOString(),
      })
      .select()
      .maybeSingle()
    
    if (error) throw error
    return data
  },

  // Puntuacions
  async addPuntuacio(userId: string, llegendaId: string, punts: number) {
    const { data, error } = await supabase
      .from('puntuacions')
      .upsert({
        usuari_id: userId,
        llegenda_id: llegendaId,
        punts,
        data_puntuacio: new Date().toISOString(),
      })
      .select()
      .maybeSingle()
    
    if (error) throw error
    return data
  },

  async getPuntuacionsUsuari(userId: string) {
    const { data, error } = await supabase
      .from('puntuacions')
      .select('*')
      .eq('usuari_id', userId)
      .order('data_puntuacio', { ascending: false })
    
    if (error) throw error
    return data || []
  },
}