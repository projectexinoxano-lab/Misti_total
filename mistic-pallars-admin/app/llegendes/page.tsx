'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Layout from '@/components/Layout'
import AuthGuard from '@/components/AuthGuard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Plus, Search, Edit, Trash2, MapPin, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import LlegendaForm from '@/components/LlegendaForm'
import GoogleMapComponent from '@/components/GoogleMapComponent'

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

export default function LlegendesPage() {
  const [llegendes, setLlegendes] = useState<Llegenda[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingLlegenda, setEditingLlegenda] = useState<Llegenda | null>(null)
  const [selectedLlegenda, setSelectedLlegenda] = useState<Llegenda | null>(null)

  useEffect(() => {
    loadLlegendes()
  }, [])

  const loadLlegendes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('llegendes')
        .select('*')
        .order('data_creacio', { ascending: false })

      if (error) {
        throw error
      }

      setLlegendes(data || [])
    } catch (error: any) {
      console.error('Error carregant llegendes:', error)
      toast.error('Error carregant les llegendes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Esteu segur que voleu eliminar aquesta llegenda?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('llegendes')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      toast.success('Llegenda eliminada correctament')
      loadLlegendes()
    } catch (error: any) {
      console.error('Error eliminant llegenda:', error)
      toast.error('Error eliminant la llegenda')
    }
  }

  const handleEdit = (llegenda: Llegenda) => {
    setEditingLlegenda(llegenda)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingLlegenda(null)
    loadLlegendes()
  }

  const toggleStatus = async (llegenda: Llegenda) => {
    try {
      const { error } = await supabase
        .from('llegendes')
        .update({ es_actiu: !llegenda.es_actiu })
        .eq('id', llegenda.id)

      if (error) {
        throw error
      }

      toast.success(`Llegenda ${!llegenda.es_actiu ? 'activada' : 'desactivada'} correctament`)
      loadLlegendes()
    } catch (error: any) {
      console.error('Error canviant estat:', error)
      toast.error('Error canviant l\'estat de la llegenda')
    }
  }

  const filteredLlegendes = llegendes.filter(llegenda =>
    llegenda.titol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    llegenda.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (showForm) {
    return (
      <AuthGuard>
        <Layout>
          <LlegendaForm
            llegenda={editingLlegenda}
            onClose={handleFormClose}
          />
        </Layout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          {/* Capçalera */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestió de Llegendes</h1>
              <p className="mt-1 text-sm text-gray-500">
                Administra les llegendes del Pallars
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="mt-4 sm:mt-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Llegenda
            </Button>
          </div>

          {/* Barra de cerca */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca per títol o categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Llista de llegendes */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Llegendes ({filteredLlegendes.length})
                </h2>
                {filteredLlegendes.map((llegenda) => (
                  <Card
                    key={llegenda.id}
                    className={`cursor-pointer transition-colors ${
                      selectedLlegenda?.id === llegenda.id
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedLlegenda(llegenda)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{llegenda.titol}</CardTitle>
                          <CardDescription className="mt-1">
                            {llegenda.categoria} • Dificultat: {llegenda.dificultat}/5
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            llegenda.es_actiu
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {llegenda.es_actiu ? 'Activa' : 'Inactiva'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        {llegenda.descripcio_curta}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {llegenda.latitud.toFixed(4)}, {llegenda.longitud.toFixed(4)}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            {llegenda.punts_recompensa} punts
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleStatus(llegenda)
                            }}
                          >
                            {llegenda.es_actiu ? 'Desactivar' : 'Activar'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEdit(llegenda)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(llegenda.id)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredLlegendes.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {searchTerm ? 'No s\'han trobat llegendes que coincideixin amb la cerca.' : 'Encara no hi ha llegendes. Crea la primera!'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Mapa */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Ubicacions al Mapa
                </h2>
                <Card>
                  <CardContent className="p-0">
                    <GoogleMapComponent
                      llegendes={filteredLlegendes}
                      selectedLlegenda={selectedLlegenda}
                      onLlegendaSelect={setSelectedLlegenda}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  )
}