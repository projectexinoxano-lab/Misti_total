// Pàgina de gestió d'usuaris
// Data: 2025-08-13

'use client';

import React, { useState, useEffect } from 'react';
import { supabase, Usuari } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  Search,
  Filter,
  Users,
  Star,
  Calendar,
  Mail,
  Trophy,
  TrendingUp,
  UserX
} from 'lucide-react';
import toast from 'react-hot-toast';

interface UsuariCardProps {
  usuari: Usuari;
}

function UsuariCard({ usuari }: UsuariCardProps) {
  const nivell = Math.floor(usuari.puntuacio_total / 100) + 1;
  const progresNivell = ((usuari.puntuacio_total % 100) / 100) * 100;
  
  const getBadgeNivell = (nivell: number) => {
    if (nivell >= 10) return { text: 'Expert', color: 'badge-success' };
    if (nivell >= 5) return { text: 'Avançat', color: 'badge-info' };
    if (nivell >= 3) return { text: 'Intermedi', color: 'badge-warning' };
    return { text: 'Principiant', color: 'badge-danger' };
  };
  
  const badge = getBadgeNivell(nivell);
  const dataCreacio = new Date(usuari.data_creacio).toLocaleDateString('ca');
  const ultimaConnexio = new Date(usuari.ultima_connexio).toLocaleDateString('ca');

  return (
    <div className="card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
            {usuari.avatar_url ? (
              <img
                src={usuari.avatar_url}
                alt={usuari.nom || 'Avatar'}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <Users className="w-6 h-6 text-primary-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {usuari.nom || 'Usuari anònim'}
            </h3>
            <p className="text-gray-600 text-sm flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {usuari.email}
            </p>
          </div>
        </div>
        <span className={`badge ${badge.color}`}>{badge.text}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-primary-600 mr-1" />
            <span className="text-lg font-bold text-primary-900">{usuari.puntuacio_total}</span>
          </div>
          <p className="text-sm text-primary-700">Punts totals</p>
        </div>
        <div className="text-center p-3 bg-secondary-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Star className="w-5 h-5 text-secondary-600 mr-1" />
            <span className="text-lg font-bold text-secondary-900">Nivell {nivell}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-secondary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progresNivell}%` }}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Registre: {dataCreacio}</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span>Última activitat: {ultimaConnexio}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsuarisPage() {
  const [usuaris, setUsuaris] = useState<Usuari[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'puntuacio' | 'data_creacio' | 'ultima_connexio'>('puntuacio');
  const [filterActive, setFilterActive] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    actius: 0,
    puntuacioMitjana: 0,
    nousSetmana: 0
  });

  useEffect(() => {
    fetchUsuaris();
  }, []);

  const fetchUsuaris = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('usuaris')
        .select('*')
        .order('puntuacio_total', { ascending: false });

      if (error) throw error;

      setUsuaris(data || []);
      
      // Calcular estadístiques
      const total = data?.length || 0;
      const fa7Dies = new Date();
      fa7Dies.setDate(fa7Dies.getDate() - 7);
      
      const fa30Dies = new Date();
      fa30Dies.setDate(fa30Dies.getDate() - 30);
      
      const actius = data?.filter(u => new Date(u.ultima_connexio) >= fa30Dies).length || 0;
      const nousSetmana = data?.filter(u => new Date(u.data_creacio) >= fa7Dies).length || 0;
      const puntuacioMitjana = total > 0 
        ? Math.round((data?.reduce((sum, u) => sum + u.puntuacio_total, 0) || 0) / total)
        : 0;
      
      setStats({ total, actius, puntuacioMitjana, nousSetmana });
    } catch (error: any) {
      console.error('Error carregant usuaris:', error);
      toast.error('Error carregant els usuaris');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar i ordenar usuaris
  const filteredUsuaris = usuaris
    .filter(usuari => {
      const matchesSearch = usuari.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           usuari.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (filterActive) {
        const fa30Dies = new Date();
        fa30Dies.setDate(fa30Dies.getDate() - 30);
        return new Date(usuari.ultima_connexio) >= fa30Dies;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'puntuacio':
          return b.puntuacio_total - a.puntuacio_total;
        case 'data_creacio':
          return new Date(b.data_creacio).getTime() - new Date(a.data_creacio).getTime();
        case 'ultima_connexio':
          return new Date(b.ultima_connexio).getTime() - new Date(a.ultima_connexio).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-transition">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Usuaris</h1>
        <p className="mt-2 text-gray-600">Gestió d'usuaris de l'aplicació Mistic Pallars</p>
      </div>

      {/* Estadístiques ràpides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total usuaris</p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.actius}</p>
          <p className="text-sm text-gray-600">Usuaris actius</p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.puntuacioMitjana}</p>
          <p className="text-sm text-gray-600">Puntuació mitjana</p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <UserX className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.nousSetmana}</p>
          <p className="text-sm text-gray-600">Nous aquesta setmana</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cercar usuaris..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-field"
          >
            <option value="puntuacio">Ordenar per puntuació</option>
            <option value="data_creacio">Ordenar per data de registre</option>
            <option value="ultima_connexio">Ordenar per última activitat</option>
          </select>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={filterActive}
              onChange={(e) => setFilterActive(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Només usuaris actius</span>
          </label>
          <div className="text-sm text-gray-600 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            {filteredUsuaris.length} de {usuaris.length} usuaris
          </div>
        </div>
      </div>

      {/* Llista d'usuaris */}
      {filteredUsuaris.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {usuaris.length === 0 ? 'No hi ha usuaris' : 'No s\'han trobat usuaris'}
          </h3>
          <p className="text-gray-600">
            {usuaris.length === 0 
              ? 'Els usuaris apareixeran quan es registrin a l\'aplicació.' 
              : 'Prova a canviar els filtres de cerca.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsuaris.map(usuari => (
            <UsuariCard key={usuari.id} usuari={usuari} />
          ))}
        </div>
      )}
    </div>
  );
}