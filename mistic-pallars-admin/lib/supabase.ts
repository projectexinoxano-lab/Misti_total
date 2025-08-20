// Client de Supabase per l'administració
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      usuaris: {
        Row: {
          id: string
          email: string
          nom: string | null
          avatar_url: string | null
          puntuacio_total: number
          data_creacio: string
          ultima_connexio: string
        }
        Insert: {
          id?: string
          email: string
          nom?: string | null
          avatar_url?: string | null
          puntuacio_total?: number
          data_creacio?: string
          ultima_connexio?: string
        }
        Update: {
          id?: string
          email?: string
          nom?: string | null
          avatar_url?: string | null
          puntuacio_total?: number
          data_creacio?: string
          ultima_connexio?: string
        }
      }
      llegendes: {
        Row: {
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
        Insert: {
          id?: string
          titol: string
          descripcio_curta?: string | null
          text_complet: string
          latitud: number
          longitud: number
          imatge_url?: string | null
          audio_url?: string | null
          categoria?: string | null
          dificultat?: number
          punts_recompensa?: number
          es_actiu?: boolean
          data_creacio?: string
          data_actualitzacio?: string
        }
        Update: {
          id?: string
          titol?: string
          descripcio_curta?: string | null
          text_complet?: string
          latitud?: number
          longitud?: number
          imatge_url?: string | null
          audio_url?: string | null
          categoria?: string | null
          dificultat?: number
          punts_recompensa?: number
          es_actiu?: boolean
          data_creacio?: string
          data_actualitzacio?: string
        }
      }
      categories: {
        Row: {
          id: string
          nom: string
          descripcio: string | null
          icona: string | null
          color: string
        }
        Insert: {
          id?: string
          nom: string
          descripcio?: string | null
          icona?: string | null
          color?: string
        }
        Update: {
          id?: string
          nom?: string
          descripcio?: string | null
          icona?: string | null
          color?: string
        }
      }
      administradors: {
        Row: {
          id: string
          email: string
          nom: string
          es_actiu: boolean
          data_creacio: string
        }
        Insert: {
          id?: string
          email: string
          nom: string
          es_actiu?: boolean
          data_creacio?: string
        }
        Update: {
          id?: string
          email?: string
          nom?: string
          es_actiu?: boolean
          data_creacio?: string
        }
      }
    }
    Functions: {
      obtenir_llegendes_properes: {
        Args: {
          lat_usuari: number
          lng_usuari: number
          radi_km?: number
        }
        Returns: {
          id: string
          titol: string
          descripcio_curta: string
          latitud: number
          longitud: number
          categoria: string
          distancia_km: number
        }[]
      }
    }
  }
}