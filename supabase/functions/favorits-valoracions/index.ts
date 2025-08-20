// Mistic Pallars - Edge Function per gestionar favorits i valoracions
// Data: 2025-08-13

import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getUserFromRequest } from '../_shared/auth.ts';
import { DatabaseClient } from '../_shared/database.ts';

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop(); // Obtenir l'última part del path
    
    const user = await getUserFromRequest(req);
    if (!user) {
      throw new Error('Autenticació requerida');
    }

    const db = new DatabaseClient();

    if (req.method === 'POST') {
      const { llegendaId, valoracio } = await req.json();
      
      if (!llegendaId) {
        throw new Error('ID de llegenda requerit');
      }

      // Verificar que la llegenda existeix
      const llegendes = await db.query('llegendes', {
        filter: { id: llegendaId, es_actiu: true }
      });

      if (llegendes.length === 0) {
        throw new Error('Llegenda no trobada');
      }

      if (action === 'favorits') {
        // Gestionar favorits
        const favoritExistent = await db.query('favorits', {
          filter: { usuari_id: user.id, llegenda_id: llegendaId }
        });

        if (favoritExistent.length > 0) {
          // Eliminar de favorits
          await db.delete('favorits', favoritExistent[0].id);
          return new Response(JSON.stringify({
            data: {
              action: 'removed',
              message: 'Llegenda eliminada de favorits'
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } else {
          // Afegir a favorits
          await db.insert('favorits', {
            usuari_id: user.id,
            llegenda_id: llegendaId,
            data_favorit: new Date().toISOString()
          });
          return new Response(JSON.stringify({
            data: {
              action: 'added',
              message: 'Llegenda afegida a favorits'
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      } else if (action === 'valoracions') {
        // Gestionar valoracions
        if (!valoracio || valoracio < 1 || valoracio > 5) {
          throw new Error('Valoració ha de ser entre 1 i 5');
        }

        const valoracioExistent = await db.query('valoracions', {
          filter: { usuari_id: user.id, llegenda_id: llegendaId }
        });

        if (valoracioExistent.length > 0) {
          // Actualitzar valoració existent
          await db.update('valoracions', valoracioExistent[0].id, {
            valoracio,
            data_valoracio: new Date().toISOString()
          });
          return new Response(JSON.stringify({
            data: {
              action: 'updated',
              valoracio,
              message: 'Valoració actualitzada'
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } else {
          // Crear nova valoració
          await db.insert('valoracions', {
            usuari_id: user.id,
            llegenda_id: llegendaId,
            valoracio,
            data_valoracio: new Date().toISOString()
          });
          return new Response(JSON.stringify({
            data: {
              action: 'created',
              valoracio,
              message: 'Valoració creada'
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
    } else if (req.method === 'GET') {
      // Obtenir favorits o valoracions de l'usuari
      if (action === 'favorits') {
        const favorits = await db.query('favorits', {
          filter: { usuari_id: user.id },
          orderBy: { column: 'data_favorit', ascending: false }
        });

        return new Response(JSON.stringify({
          data: { favorits }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else if (action === 'valoracions') {
        const valoracions = await db.query('valoracions', {
          filter: { usuari_id: user.id },
          orderBy: { column: 'data_valoracio', ascending: false }
        });

        return new Response(JSON.stringify({
          data: { valoracions }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    throw new Error('Acció o mètode no suportat');

  } catch (error) {
    console.error('Error gestionant favorits/valoracions:', error);

    const errorResponse = {
      error: {
        code: 'FAVORITES_RATINGS_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});