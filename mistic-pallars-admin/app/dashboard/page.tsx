'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Layout from '@/components/Layout'
import AuthGuard from '@/components/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Users, MapPin, Star, Activity } from 'lucide-react'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalUsuaris: number
  totalLlegendes: number
  totalValoracionsSetmana: number
  puntuacioMitjana: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsuaris: 0,
    totalLlegendes: 0,
    totalValoracionsSetmana: 0,
    puntuacioMitjana: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)

      // Obtenir total d'usuaris
      const { count: totalUsuaris } = await supabase
        .from('usuaris')
        .select('*', { count: 'exact', head: true })

      // Obtenir total de llegendes actives
      const { count: totalLlegendes } = await supabase
        .from('llegendes')
        .select('*', { count: 'exact', head: true })
        .eq('es_actiu', true)

      // Obtenir valoracions de la setmana passada
      const setmanaPassada = new Date()
      setmanaPassada.setDate(setmanaPassada.getDate() - 7)

      const { count: totalValoracionsSetmana } = await supabase
        .from('valoracions')
        .select('*', { count: 'exact', head: true })
        .gte('data_valoracio', setmanaPassada.toISOString())

      // Obtenir puntuació mitjana de valoracions
      const { data: valoracionsData } = await supabase
        .from('valoracions')
        .select('valoracio')

      let puntuacioMitjana = 0
      if (valoracionsData && valoracionsData.length > 0) {
        const suma = valoracionsData.reduce((acc, curr) => acc + curr.valoracio, 0)
        puntuacioMitjana = suma / valoracionsData.length
      }

      setStats({
        totalUsuaris: totalUsuaris || 0,
        totalLlegendes: totalLlegendes || 0,
        totalValoracionsSetmana: totalValoracionsSetmana || 0,
        puntuacioMitjana: Number(puntuacioMitjana.toFixed(1)),
      })
    } catch (error) {
      console.error('Error carregant estadístiques:', error)
      toast.error('Error carregant les estadístiques del panell')
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: 'Total Usuaris',
      value: stats.totalUsuaris,
      description: 'Usuaris registrats a l\'aplicació',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Llegendes Actives',
      value: stats.totalLlegendes,
      description: 'Llegendes disponibles per explorar',
      icon: MapPin,
      color: 'text-green-600',
    },
    {
      title: 'Valoracions (7 dies)',
      value: stats.totalValoracionsSetmana,
      description: 'Noves valoracions aquesta setmana',
      icon: Activity,
      color: 'text-purple-600',
    },
    {
      title: 'Valoració Mitjana',
      value: `${stats.puntuacioMitjana}/5`,
      description: 'Satisfacció general dels usuaris',
      icon: Star,
      color: 'text-yellow-600',
    },
  ]

  if (loading) {
    return (
      <AuthGuard>
        <Layout>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panell de Control</h1>
              <p className="mt-1 text-sm text-gray-500">
                Resum de l'activitat de Mistic Pallars
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Layout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panell de Control</h1>
            <p className="mt-1 text-sm text-gray-500">
              Resum de l'activitat de Mistic Pallars
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-gray-500">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activitat Recent</CardTitle>
                <CardDescription>
                  Últimes accions dels usuaris
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Sistema de gamificació actiu
                      </p>
                      <p className="text-sm text-gray-500">
                        Els usuaris estan guanyant punts explorant llegendes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Geocalizació funcionant
                      </p>
                      <p className="text-sm text-gray-500">
                        Les llegendes es mostren segons la ubicació dels usuaris
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estat del Sistema</CardTitle>
                <CardDescription>
                  Informació sobre el funcionament de l'aplicació
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Base de Dades</p>
                      <p className="text-sm text-gray-500">Supabase PostgreSQL</p>
                    </div>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Autenticació</p>
                      <p className="text-sm text-gray-500">Supabase Auth</p>
                    </div>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Emmagatzematge</p>
                      <p className="text-sm text-gray-500">Supabase Storage</p>
                    </div>
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}