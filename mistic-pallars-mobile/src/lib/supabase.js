// Placeholder Supabase client - NO AUTH, NO BACKEND CONNECTION
// This is just a stub to prepare for future backend integration

// Mock client that does nothing but prevents errors
const mockSupabase = {
  from: (table) => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  },
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};

// Export the mock client (no real connection)
export const supabase = mockSupabase;

// Helper function to check if real Supabase is configured
export const isSupabaseConfigured = () => false;

// Future: Replace with real Supabase client when backend is ready
// import { createClient } from '@supabase/supabase-js';
// export const supabase = createClient(url, key);
