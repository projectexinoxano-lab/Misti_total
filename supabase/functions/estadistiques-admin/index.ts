// Mistic Pallars - Edge Function per estadístiques d'administració
// Data: 2025-08-13

import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getUserFromRequest, isAdmin } from '../_shared/auth.ts';
import { DatabaseClient } from '../_shared/database.ts';

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Verificar que l'usuari és administrador
    const user = await getUserFromRequest(req);
    if (!user) {
      throw new Error('Autenticació requerida');
    }

    const isUserAdmin = await isAdmin(user.id);
    if (!isUserAdmin) {
      throw new Error('Accés restringit a administradors');
    }

    const db = new DatabaseClient();

    // Estadístiques generals
    const totalUsuaris = await db.query('usuaris');
    const totalLlegendes = await db.query('llegendes');
    const llegendiesActives = await db.query('llegendes', {
      filter: { es_actiu: true }
    });
    const totalPuntuacions = await db.query('puntuacions');
    const totalFavorits = await db.query('favorits');
    const totalValoracions = await db.query('valoracions');

    // Estadístiques d'usuaris actius (amb activitat en els últims 30 dies)
    const fa30Dies = new Date();
    fa30Dies.setDate(fa30Dies.getDate() - 30);
    
    const usuarisActius = totalUsuaris.filter((u: any) => 
      new Date(u.ultima_connexio) >= fa30Dies
    );

    // Puntuacions per categoria de llegenda
    const puntuacionsPerCategoria: Record<string, number> = {};
    const puntuacionsDetallades = await db.query('puntuacions', {
      select: 'punts,llegendes(categoria)'
    });

    for (const puntuacio of puntuacionsDetallades) {
      const categoria = puntuacio.llegendes?.categoria || 'Sense categoria';
      puntuacionsPerCategoria[categoria] = (puntuacionsPerCategoria[categoria] || 0) + puntuacio.punts;
    }

    // Llegendes més populars (per nombre de favorits)
    const llegendiesPopulars = await db.query('favorits', {
      select: 'llegenda_id,llegendes(titol)'
    });
    
    const contadorPopularitat: Record<string, { titol: string; favorits: number }> = {};
    for (const favorit of llegendiesPopulars) {
      const id = favorit.llegenda_id;
      const titol = favorit.llegendes?.titol || 'Sense títol';
      
      if (!contadorPopularitat[id]) {
        contadorPopularitat[id] = { titol, favorits: 0 };
      }
      contadorPopularitat[id].favorits++;
    }

    const top5Populars = Object.entries(contadorPopularitat)
      .sort(([,a], [,b]) => b.favorits - a.favorits)
      .slice(0, 5)
      .map(([id, data]) => ({ id, ...data }));

    // Usuaris més actius (per puntuació total)
    const topUsuaris = totalUsuaris
      .sort((a: any, b: any) => b.puntuacio_total - a.puntuacio_total)
      .slice(0, 10)
      .map((u: any) => ({
        id: u.id,
        nom: u.nom || 'Usuari anònim',
        email: u.email,
        puntuacio_total: u.puntuacio_total,
        ultima_connexio: u.ultima_connexio
      }));

    // Valoració mitjana de les llegendes
    const valoracioMitjana = totalValoracions.length > 0 
      ? totalValoracions.reduce((sum: number, v: any) => sum + v.valoracio, 0) / totalValoracions.length
      : 0;

    // Activitat dels últims 7 dies
    const fa7Dies = new Date();
    fa7Dies.setDate(fa7Dies.getDate() - 7);
    
    const activitatSetmana = totalPuntuacions.filter((p: any) => 
      new Date(p.data_puntuacio) >= fa7Dies
    ).length;

    const noususuarisSetmana = totalUsuaris.filter((u: any) => 
      new Date(u.data_creacio) >= fa7Dies
    ).length;

    return new Response(JSON.stringify({
      data: {
        resum: {
          totalUsuaris: totalUsuaris.length,
          usuarisActius: usuarisActius.length,
          totalLlegendes: totalLlegendes.length,
          llegendiesActives: llegendiesActives.length,
          totalPuntuacions: totalPuntuacions.length,
          totalFavorits: totalFavorits.length,
          totalValoracions: totalValoracions.length,
          valoracioMitjana: Math.round(valoracioMitjana * 100) / 100
        },
        activitatSetmana: {
          novesAccions: activitatSetmana,
          nousUsuaris: noususuarisSetmana
        },
        puntuacionsPerCategoria,
        llegendiesPopulars: top5Populars,
        topUsuaris
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error obtenint estadístiques:', error);

    const errorResponse = {
      error: {
        code: 'STATISTICS_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});