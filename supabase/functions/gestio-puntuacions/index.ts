// Mistic Pallars - Edge Function per gestionar puntuacions
// Data: 2025-08-13

import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getUserFromRequest } from '../_shared/auth.ts';
import { DatabaseClient } from '../_shared/database.ts';

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { llegendaId, tipusAccio } = await req.json();

    if (!llegendaId || !tipusAccio) {
      throw new Error('ID de llegenda i tipus d’acció són requerits');
    }

    const user = await getUserFromRequest(req);
    if (!user) {
      throw new Error('Autenticació requerida');
    }

    const db = new DatabaseClient();

    // Verificar que la llegenda existeix i és activa
    const llegendes = await db.query('llegendes', {
      filter: { id: llegendaId, es_actiu: true }
    });

    if (llegendes.length === 0) {
      throw new Error('Llegenda no trobada o inactiva');
    }

    // Verificar si l'usuari ja ha rebut punts per aquesta llegenda i acció
    const puntuacionsExistents = await db.query('puntuacions', {
      filter: { usuari_id: user.id, llegenda_id: llegendaId }
    });

    // Definir punts segons el tipus d'acció
    const puntsPorAccio: Record<string, number> = {
      'llegir_llegenda': 10,
      'escoltar_audio': 15,
      'visitar_ubicacio': 25,
      'compartir_llegenda': 5,
      'valorar_llegenda': 3
    };

    const punts = puntsPorAccio[tipusAccio];
    if (punts === undefined) {
      throw new Error('Tipus d’acció no vàlid');
    }

    // Verificar si ja ha rebut punts per aquesta acció específica
    const accioJaRealitzada = puntuacionsExistents.some((p: any) => {
      // Depenent del tipus d'acció, aplicar lògica diferent
      if (tipusAccio === 'llegir_llegenda' || tipusAccio === 'escoltar_audio' || tipusAccio === 'visitar_ubicacio') {
        // Aquestes accions només donen punts una vegada per llegenda
        return p.punts === punts;
      }
      return false; // Compartir i valorar poden donar punts múltiples vegades
    });

    if (accioJaRealitzada && (tipusAccio === 'llegir_llegenda' || tipusAccio === 'escoltar_audio' || tipusAccio === 'visitar_ubicacio')) {
      return new Response(JSON.stringify({
        data: {
          message: 'Ja has rebut punts per aquesta acció',
          punts: 0,
          puntuacioTotal: null
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Afegir nova puntuació
    await db.insert('puntuacions', {
      usuari_id: user.id,
      llegenda_id: llegendaId,
      punts: punts,
      data_puntuacio: new Date().toISOString()
    });

    // Actualitzar puntuació total de l'usuari
    const totesPuntuacions = await db.query('puntuacions', {
      filter: { usuari_id: user.id }
    });

    const puntuacioTotal = totesPuntuacions.reduce((total: number, p: any) => total + p.punts, 0);

    await db.update('usuaris', user.id, {
      puntuacio_total: puntuacioTotal,
      ultima_connexio: new Date().toISOString()
    });

    // Calcular nivell i progrés
    const nivell = Math.floor(puntuacioTotal / 100) + 1;
    const puntsPerSeguent = ((nivell) * 100) - puntuacioTotal;
    const progresNivell = ((puntuacioTotal % 100) / 100) * 100;

    return new Response(JSON.stringify({
      data: {
        puntsGuanyats: punts,
        puntuacioTotal,
        nivell,
        puntsPerSeguent,
        progresNivell: Math.round(progresNivell),
        tipusAccio
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error gestionant puntuacions:', error);

    const errorResponse = {
      error: {
        code: 'SCORE_MANAGEMENT_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});