// Mistic Pallars - Utilitats d'autenticació compartides
// Data: 2025-08-13

export async function getUserFromRequest(req: Request): Promise<{ id: string; email: string } | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Configuració Supabase mancant');
  }

  try {
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': serviceRoleKey
      }
    });

    if (!userResponse.ok) {
      return null;
    }

    const userData = await userResponse.json();
    return {
      id: userData.id,
      email: userData.email
    };
  } catch (error) {
    console.error('Error verificant usuari:', error);
    return null;
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    return false;
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/administradors?id=eq.${userId}&es_actiu=eq.true`, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    });

    if (!response.ok) {
      return false;
    }

    const admins = await response.json();
    return admins.length > 0;
  } catch (error) {
    console.error('Error verificant admin:', error);
    return false;
  }
}