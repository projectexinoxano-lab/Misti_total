// Pàgina de mapa interactiu
// Data: 2025-08-13

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase, Llegenda } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { 
  MapPin, 
  Filter, 
  RefreshCw,
  Info,
  Eye,
  Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';

// Tipus per Google Maps
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface MapaProps {
  llegendes: Llegenda[];
  selectedCategory: string;
  onLlegendaSelect: (llegenda: Llegenda) => void;
}

function GoogleMap({ llegendes, selectedCategory, onLlegendaSelect }: MapaProps) {
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const initializeMap = useCallback(() => {
    if (!window.google) {
      setLoading(false);
      toast.error('Error carregant Google Maps');
      return;
    }

    const mapCenter = { lat: 42.5, lng: 1.0 }; // Centre aproximat del Pallars
    
    const mapInstance = new window.google.maps.Map(
      document.getElementById('map'),
      {
        zoom: 10,
        center: mapCenter,
        styles: [
          {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{ "color": "#f2f2f2" }]
          },
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{ "color": "#46bcec" }]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{ "color": "#c5dac6" }]
          }
        ],
        restriction: {
          latLngBounds: {
            north: 43.0,
            south: 42.0,
            west: 0.5,
            east: 1.5,
          },
          strictBounds: false,
        },
      }
    );
    
    setMap(mapInstance);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        setLoading(false);
        toast.error('Error carregant Google Maps');
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, [initializeMap]);

  useEffect(() => {
    if (!map || !window.google) return;

    // Eliminar markers existents
    markers.forEach(marker => marker.setMap(null));
    
    const newMarkers: any[] = [];
    const bounds = new window.google.maps.LatLngBounds();
    
    const filteredLlegendes = selectedCategory 
      ? llegendes.filter(l => l.categoria === selectedCategory && l.es_actiu)
      : llegendes.filter(l => l.es_actiu);

    filteredLlegendes.forEach((llegenda) => {
      const position = {
        lat: llegenda.latitud,
        lng: llegenda.longitud
      };
      
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: llegenda.titol,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getCategoryColor(llegenda.categoria),
          fillOpacity: 0.8,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
      });
      
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <h3 class="font-semibold text-gray-900 mb-2">${llegenda.titol}</h3>
            <p class="text-sm text-gray-600 mb-3">${llegenda.descripcio_curta || ''}</p>
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" 
                    style="background-color: ${getCategoryColor(llegenda.categoria)}20; color: ${getCategoryColor(llegenda.categoria)}">
                ${llegenda.categoria || 'Sense categoria'}
              </span>
              <button 
                onclick="window.selectLlegenda('${llegenda.id}')"
                class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Veure detalls
              </button>
            </div>
          </div>
        `
      });
      
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
      
      newMarkers.push(marker);
      bounds.extend(position);
    });
    
    setMarkers(newMarkers);
    
    if (newMarkers.length > 0) {
      map.fitBounds(bounds);
      if (newMarkers.length === 1) {
        map.setZoom(15);
      }
    }
    
    // Funció global per seleccionar llegenda des del InfoWindow
    window.selectLlegenda = (id: string) => {
      const llegenda = llegendes.find(l => l.id === id);
      if (llegenda) {
        onLlegendaSelect(llegenda);
      }
    };
    
  }, [map, llegendes, selectedCategory, onLlegendaSelect, markers]);

  const getCategoryColor = (categoria: string | undefined) => {
    const colors: Record<string, string> = {
      'Fades i éssers màgics': '#10B981',
      'Tresors ocults': '#F59E0B',
      'Bruixes i curanderes': '#8B5CF6',
      'Dracs i monstres': '#EF4444',
      'Esperits i fantasmes': '#6B7280',
      'Llegendes d\'amor': '#EC4899',
      'Històries de bandolers': '#F97316',
      'Mites ancestrals': '#3B82F6',
    };
    return colors[categoria || ''] || '#6B7280';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Carregant mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div id="map" className="w-full h-full rounded-lg" />
      {!window.google && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Error carregant Google Maps</p>
            <p className="text-sm text-gray-500">Verifica la clau API</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface LlegendaDetailProps {
  llegenda: Llegenda;
  onClose: () => void;
  onEdit: (llegenda: Llegenda) => void;
}

function LlegendaDetail({ llegenda, onClose, onEdit }: LlegendaDetailProps) {
  return (
    <div className="card h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{llegenda.titol}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(llegenda)}
            className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
            title="Editar"
          >
            <Edit3 className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {llegenda.imatge_url && (
        <img
          src={llegenda.imatge_url}
          alt={llegenda.titol}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="space-y-4">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: getCategoryColor(llegenda.categoria) + '20', 
                  color: getCategoryColor(llegenda.categoria) 
                }}>
            {llegenda.categoria || 'Sense categoria'}
          </span>
        </div>
        
        {llegenda.descripcio_curta && (
          <p className="text-gray-600 italic">{llegenda.descripcio_curta}</p>
        )}
        
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: llegenda.text_complet }}
        />
        
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Coordenades:</span>
              <p className="text-gray-600">{llegenda.latitud.toFixed(6)}, {llegenda.longitud.toFixed(6)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Estat:</span>
              <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                llegenda.es_actiu ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {llegenda.es_actiu ? 'Activa' : 'Inactiva'}
              </p>
            </div>
          </div>
          
          {llegenda.audio_url && (
            <div className="mt-4">
              <span className="font-medium text-gray-700 block mb-2">Narració d'àudio:</span>
              <audio controls className="w-full">
                <source src={llegenda.audio_url} type="audio/mpeg" />
                El teu navegador no suporta la reproducció d'àudio.
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(categoria: string | undefined) {
  const colors: Record<string, string> = {
    'Fades i éssers màgics': '#10B981',
    'Tresors ocults': '#F59E0B',
    'Bruixes i curanderes': '#8B5CF6',
    'Dracs i monstres': '#EF4444',
    'Esperits i fantasmes': '#6B7280',
    'Llegendes d\'amor': '#EC4899',
    'Històries de bandolers': '#F97316',
    'Mites ancestrals': '#3B82F6',
  };
  return colors[categoria || ''] || '#6B7280';
}

export default function MapaPage() {
  const [llegendes, setLlegendes] = useState<Llegenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLlegenda, setSelectedLlegenda] = useState<Llegenda | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchLlegendes();
  }, []);

  const fetchLlegendes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('llegendes')
        .select('*')
        .order('titol');

      if (error) throw error;

      setLlegendes(data || []);
      
      // Extreure categories úniques
      const uniqueCategories = [...new Set(data?.map(l => l.categoria).filter(Boolean))] as string[];
      setCategories(uniqueCategories);
    } catch (error: any) {
      console.error('Error carregant llegendes:', error);
      toast.error('Error carregant les llegendes');
    } finally {
      setLoading(false);
    }
  };

  const activeLegendsCount = llegendes.filter(l => l.es_actiu).length;
  const filteredCount = selectedCategory 
    ? llegendes.filter(l => l.categoria === selectedCategory && l.es_actiu).length
    : activeLegendsCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-transition">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mapa de Llegendes</h1>
          <p className="mt-2 text-gray-600">Visualització geogràfica de les llegendes del Pallars</p>
        </div>
        <button
          onClick={fetchLlegendes}
          className="btn-secondary flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualitzar
        </button>
      </div>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field min-w-48"
            >
              <option value="">Totes les categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Info className="w-4 h-4 mr-1" />
              <span>Mostrant {filteredCount} de {activeLegendsCount} llegendes actives</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa i detalls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <div className="lg:col-span-2">
          <GoogleMap
            llegendes={llegendes}
            selectedCategory={selectedCategory}
            onLlegendaSelect={setSelectedLlegenda}
          />
        </div>
        <div className="lg:col-span-1">
          {selectedLlegenda ? (
            <LlegendaDetail
              llegenda={selectedLlegenda}
              onClose={() => setSelectedLlegenda(null)}
              onEdit={(llegenda) => {
                // Aquí podries obrir el formulari d'edició
                toast.info('Funció d\'edició disponible a la pàgina de Llegendes');
              }}
            />
          ) : (
            <div className="card h-full flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una llegenda</h3>
                <p className="text-gray-600">Fes clic en un marcador del mapa per veure els detalls</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Llegenda de colors */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Llegenda de Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map(category => (
            <div key={category} className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: getCategoryColor(category) }}
              />
              <span className="text-sm text-gray-700">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}