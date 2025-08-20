// Mistic Pallars - Edge Function per upload segur de multimèdia
// Data: 2025-08-13

import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { getUserFromRequest, isAdmin } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { fileData, fileName, fileType, llegendaId } = await req.json();

    if (!fileData || !fileName || !fileType) {
      throw new Error('Dades del fitxer, nom i tipus són requerits');
    }

    // Verificar que l'usuari és administrador
    const user = await getUserFromRequest(req);
    if (!user) {
      throw new Error('Autenticació requerida');
    }

    const isUserAdmin = await isAdmin(user.id);
    if (!isUserAdmin) {
      throw new Error('Només els administradors poden pujar fitxers');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Configuració Supabase mancant');
    }

    // Determinar el bucket segons el tipus de fitxer
    let bucket = '';
    if (fileType.startsWith('image/')) {
      bucket = 'llegendes-imatges';
    } else if (fileType.startsWith('audio/')) {
      bucket = 'llegendes-audios';
    } else {
      throw new Error('Tipus de fitxer no suportat. Només imatges i àudios.');
    }

    // Validar mida del fitxer
    const base64Data = fileData.split(',')[1];
    const fileSizeBytes = (base64Data.length * 3) / 4;
    const maxSize = fileType.startsWith('image/') ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB imatges, 50MB àudios
    
    if (fileSizeBytes > maxSize) {
      throw new Error(`El fitxer és massa gran. Màxim ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    // Generar nom únic per evitar conflictes
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Convertir base64 a binary
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Pujar a Supabase Storage
    const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${uniqueFileName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': fileType,
        'x-upsert': 'true'
      },
      body: binaryData
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Error en upload: ${errorText}`);
    }

    // Obtenir URL pública
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${uniqueFileName}`;

    // Si es proporciona llegendaId, actualitzar la llegenda
    if (llegendaId) {
      const updateField = fileType.startsWith('image/') ? 'imatge_url' : 'audio_url';
      
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/llegendes?id=eq.${llegendaId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          [updateField]: publicUrl,
          data_actualitzacio: new Date().toISOString()
        })
      });

      if (!updateResponse.ok) {
        console.error('Error actualitzant llegenda:', await updateResponse.text());
      }
    }

    return new Response(JSON.stringify({
      data: {
        publicUrl,
        fileName: uniqueFileName,
        fileSize: fileSizeBytes,
        fileType,
        bucket
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en upload de multimèdia:', error);

    const errorResponse = {
      error: {
        code: 'MEDIA_UPLOAD_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});