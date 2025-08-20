'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ArrowLeft, Save, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

interface Llegenda {
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

interface LlegendaFormProps {
  llegenda?: Llegenda | null
  onClose: () => void
}

const categories = [
  'Fades i éssers màgics',
  'Tresors ocults',
  'Bruixes i curanderes',
  'Dracs i monstres',
  'Esperits i fantasmes',
  'Llegendes històriques',
]

export default function LlegendaForm({ llegenda, onClose }: LlegendaFormProps) {
  const [formData, setFormData] = useState({
    titol: '',
    descripcio_curta: '',
    text_complet: '',
    latitud: 42.5,
    longitud: 1.0,
    categoria: '',
    dificultat: 1,
    punts_recompensa: 10,
    es_actiu: true,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (llegenda) {
      setFormData({
        titol: llegenda.titol,
        descripcio_curta: llegenda.descripcio_curta || '',
        text_complet: llegenda.text_complet,
        latitud: llegenda.latitud,
        longitud: llegenda.longitud,
        categoria: llegenda.categoria || '',
        dificultat: llegenda.dificultat,
        punts_recompensa: llegenda.punts_recompensa,
        es_actiu: llegenda.es_actiu,
      })
    }
  }, [llegenda])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (llegenda) {
        // Actualitzar llegenda existent
        const { error } = await supabase
          .from('llegendes')
          .update({
            ...formData,
            data_actualitzacio: new Date().toISOString(),
          })
          .eq('id', llegenda.id)

        if (error) throw error
        toast.success('Llegenda actualitzada correctament')
      } else {
        // Crear nova llegenda
        const { error } = await supabase
          .from('llegendes')
          .insert([formData])

        if (error) throw error
        toast.success('Llegenda creada correctament')
      }

      onClose()
    } catch (error: any) {
      console.error('Error guardant llegenda:', error)
      toast.error('Error guardant la llegenda')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleMapClick = (e: any) => {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setFormData(prev => ({
      ...prev,
      latitud: lat,
      longitud: lng
    }))
    toast.success(`Ubicació actualitzada: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tornar
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {llegenda ? 'Editar Llegenda' : 'Nova Llegenda'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informació bàsica */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informació Bàsica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="titol" className="block text-sm font-medium text-gray-700 mb-1">
                  Títol *
                </label>
                <Input
                  id="titol"
                  name="titol"
                  value={formData.titol}
                  onChange={handleChange}
                  placeholder="La Llegenda del..."
                  required
                />
              </div>

              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona una categoria</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="descripcio_curta" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripció Curta
                </label>
                <textarea
                  id="descripcio_curta"
                  name="descripcio_curta"
                  value={formData.descripcio_curta}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Breu descripció de la llegenda..."
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="text_complet" className="block text-sm font-medium text-gray-700 mb-1">
                  Text Complet *
                </label>
                <textarea
                  id="text_complet"
                  name="text_complet"
                  value={formData.text_complet}
                  onChange={handleChange}
                  rows={10}
                  placeholder="Relat complet de la llegenda..."
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuració i ubicació */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuració</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="dificultat" className="block text-sm font-medium text-gray-700 mb-1">
                  Dificultat (1-5)
                </label>
                <Input
                  id="dificultat"
                  name="dificultat"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.dificultat}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="punts_recompensa" className="block text-sm font-medium text-gray-700 mb-1">
                  Punts de Recompensa
                </label>
                <Input
                  id="punts_recompensa"
                  name="punts_recompensa"
                  type="number"
                  min="0"
                  value={formData.punts_recompensa}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="es_actiu"
                  name="es_actiu"
                  type="checkbox"
                  checked={formData.es_actiu}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="es_actiu" className="ml-2 block text-sm text-gray-700">
                  Llegenda activa
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ubicació</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="latitud" className="block text-sm font-medium text-gray-700 mb-1">
                  Latitud
                </label>
                <Input
                  id="latitud"
                  name="latitud"
                  type="number"
                  step="any"
                  value={formData.latitud}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="longitud" className="block text-sm font-medium text-gray-700 mb-1">
                  Longitud
                </label>
                <Input
                  id="longitud"
                  name="longitud"
                  type="number"
                  step="any"
                  value={formData.longitud}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="text-sm text-gray-500 p-3 bg-blue-50 rounded-md">
                <MapPin className="w-4 h-4 inline mr-1" />
                Clica al mapa per seleccionar la ubicació
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col space-y-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                'Guardant...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {llegenda ? 'Actualitzar' : 'Crear'} Llegenda
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="w-full">
              Cancel·lar
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}