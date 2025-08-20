// Mistic Pallars - Edge Function per obtenir llegendes per proximitat
// Data: 2025-08-13

import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getUserFromRequest } from '../_shared/auth.ts';
import { DatabaseClient } from '../_shared/database.ts';

// Funció per calcular distància entre dos punts (fórmula Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radi de la Terra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { latitud, longitud, radi = 10 } = await req.json();

    if (!latitud || !longitud) {
      throw new Error('Latitud i longitud són requerits');
    }

    // Validar que les coordenades estan dins del Pallars (aprox.)
    if (latitud < 42.0 || latitud > 43.0 || longitud < 0.5 || longitud > 1.5) {
      throw new Error('Coordenades fora de la regió del Pallars');
    }

    const db = new DatabaseClient();
    
    // Obtenir totes les llegendes actives
    const llegendes = await db.query('llegendes', {
      filter: { es_actiu: true },
      orderBy: { column: 'data_creacio', ascending: false }
    });

    // Filtrar per proximitat
    const llegendesProximes = llegendes
      .map((llegenda: any) => {
        const distancia = calculateDistance(
          latitud, longitud,
          parseFloat(llegenda.latitud), parseFloat(llegenda.longitud)
        );
        return { ...llegenda, distancia };
      })
      .filter((llegenda: any) => llegenda.distancia <= radi)
      .sort((a: any, b: any) => a.distancia - b.distancia);

    // Obtenir l'usuari si està autenticat per personalitzar la resposta
    const user = await getUserFromRequest(req);
    let favorits = [];
    let valoracions = [];

    if (user) {
      // Obtenir favorits de l'usuari
      favorits = await db.query('favorits', {
        filter: { usuari_id: user.id }
      });

      // Obtenir valoracions de l'usuari
      valoracions = await db.query('valoracions', {
        filter: { usuari_id: user.id }
      });
    }

    // Afegir informació de favorits i valoracions
    const llegendiesFinals = llegendesProximes.map((llegenda: any) => ({
      ...llegenda,
      es_favorit: favorits.some((f: any) => f.llegenda_id === llegenda.id),
      valoracio_usuari: valoracions.find((v: any) => v.llegenda_id === llegenda.id)?.valoracio || null
    }));

    return new Response(JSON.stringify({
      data: {
        llegendes: llegendiesFinals,
        total: llegendiesFinals.length,
        radi_km: radi,
        coordenades: { latitud, longitud }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error obtenint llegendes per proximitat:', error);

    const errorResponse = {
      error: {
        code: 'PROXIMITY_SEARCH_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});