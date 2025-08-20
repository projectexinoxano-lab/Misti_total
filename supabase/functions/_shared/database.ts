// Mistic Pallars - Utilitats de base de dades compartides
// Data: 2025-08-13

export class DatabaseClient {
  private supabaseUrl: string;
  private serviceRoleKey: string;

  constructor() {
    this.supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    this.serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!this.supabaseUrl || !this.serviceRoleKey) {
      throw new Error('Configuració Supabase mancant');
    }
  }

  async query(table: string, options: {
    select?: string;
    filter?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  } = {}) {
    let url = `${this.supabaseUrl}/rest/v1/${table}`;
    
    const params = new URLSearchParams();
    
    if (options.select) {
      params.append('select', options.select);
    }
    
    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        params.append(key, `eq.${value}`);
      });
    }
    
    if (options.orderBy) {
      params.append('order', `${options.orderBy.column}.${options.orderBy.ascending !== false ? 'asc' : 'desc'}`);
    }
    
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.serviceRoleKey}`,
        'apikey': this.serviceRoleKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error en consulta: ${response.statusText}`);
    }
    
    return await response.json();
  }

  async insert(table: string, data: Record<string, any>) {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.serviceRoleKey}`,
        'apikey': this.serviceRoleKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Error en inserció: ${response.statusText}`);
    }
    
    return await response.json();
  }

  async update(table: string, id: string, data: Record<string, any>) {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.serviceRoleKey}`,
        'apikey': this.serviceRoleKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Error en actualització: ${response.statusText}`);
    }
    
    return await response.json();
  }

  async delete(table: string, id: string) {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.serviceRoleKey}`,
        'apikey': this.serviceRoleKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error en eliminació: ${response.statusText}`);
    }
    
    return true;
  }
}