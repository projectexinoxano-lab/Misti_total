'use client'

import { useEffect, useRef } from 'react'

interface Llegenda {
  id: string
  titol: string
  latitud: number
  longitud: number
  categoria: string | null
  es_actiu: boolean
}

interface GoogleMapComponentProps {
  llegendes: Llegenda[]
  selectedLlegenda: Llegenda | null
  onLlegendaSelect: (llegenda: Llegenda) => void
}

export default function GoogleMapComponent({ 
  llegendes, 
  selectedLlegenda, 
  onLlegendaSelect 
}: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.google) return

      // Configuració del mapa centrat al Pallars
      const mapOptions: google.maps.MapOptions = {
        center: { lat: 42.5680, lng: 0.9970 }, // Pallars Sobirà
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      }

      mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions)
      infoWindowRef.current = new google.maps.InfoWindow()

      updateMarkers()
    }

    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=ca&region=ES`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    }

    loadGoogleMaps()
  }, [])

  useEffect(() => {
    updateMarkers()
  }, [llegendes])

  useEffect(() => {
    if (selectedLlegenda && mapInstanceRef.current) {
      const marker = markersRef.current.find(
        marker => marker.get('llegendaId') === selectedLlegenda.id
      )
      if (marker) {
        mapInstanceRef.current.panTo(marker.getPosition()!)
        mapInstanceRef.current.setZoom(14)
        
        // Mostrar info window
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${selectedLlegenda.titol}</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">${selectedLlegenda.categoria || 'Sense categoria'}</p>
              <p style="margin: 4px 0 0 0; font-size: 12px;">
                <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; ${
                  selectedLlegenda.es_actiu 
                    ? 'background-color: #dcfce7; color: #166534;' 
                    : 'background-color: #fee2e2; color: #991b1b;'
                }">
                  ${selectedLlegenda.es_actiu ? 'Activa' : 'Inactiva'}
                </span>
              </p>
            </div>
          `)
          infoWindowRef.current.open(mapInstanceRef.current, marker)
        }
      }
    }
  }, [selectedLlegenda])

  const updateMarkers = () => {
    if (!mapInstanceRef.current) return

    // Eliminar marcadors existents
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Crear nous marcadors
    llegendes.forEach(llegenda => {
      const marker = new google.maps.Marker({
        position: { lat: llegenda.latitud, lng: llegenda.longitud },
        map: mapInstanceRef.current,
        title: llegenda.titol,
        icon: {
          url: llegenda.es_actiu 
            ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5UzkuNSA2LjUgMTIgNi41UzE0LjUgNy42MiAxNC41IDlTMTMuMzggMTEuNSAxMiAxMS41WiIgZmlsbD0iIzIyOWE0NyIvPgo8L3N2Zz4K'
            : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5UzkuNSA2LjUgMTIgNi41UzE0LjUgNy42MiAxNC41IDlTMTMuMzggMTEuNSAxMiAxMS41WiIgZmlsbD0iIzk5MTkxOSIvPgo8L3N2Zz4K',
          scaledSize: new google.maps.Size(24, 24),
        },
        animation: selectedLlegenda?.id === llegenda.id ? google.maps.Animation.BOUNCE : undefined,
      })

      marker.set('llegendaId', llegenda.id)

      marker.addListener('click', () => {
        onLlegendaSelect(llegenda)
      })

      markersRef.current.push(marker)
    })

    // Ajustar zoom per mostrar tots els marcadors
    if (llegendes.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      llegendes.forEach(llegenda => {
        bounds.extend({ lat: llegenda.latitud, lng: llegenda.longitud })
      })
      mapInstanceRef.current.fitBounds(bounds)
      
      // Evitar zoom excessiu per una sola llegenda
      google.maps.event.addListenerOnce(mapInstanceRef.current, 'bounds_changed', () => {
        if (llegendes.length === 1 && mapInstanceRef.current!.getZoom()! > 15) {
          mapInstanceRef.current!.setZoom(15)
        }
      })
    }
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-96 rounded-lg"
      style={{ minHeight: '400px' }}
    >
      {!window.google && (
        <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Carregant mapa...</p>
          </div>
        </div>
      )}
    </div>
  )
}