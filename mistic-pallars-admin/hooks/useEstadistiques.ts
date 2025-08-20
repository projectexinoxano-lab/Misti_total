// Hook personalitzat per gestionar estadístiques
// Data: 2025-08-13

import { useState, useEffect } from 'react';
import { supabase, Estadistiques } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface UseEstadistiquesReturn {
  estadistiques: Estadistiques | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEstadistiques(): UseEstadistiquesReturn {
  const [estadistiques, setEstadistiques] = useState<Estadistiques | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();

  const fetchEstadistiques = async () => {
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('estadistiques-admin');

      if (functionError) {
        throw functionError;
      }

      if (data?.error) {
        throw new Error(data.error.message);
      }

      setEstadistiques(data.data);
    } catch (err: any) {
      console.error('Error obtenint estadístiques:', err);
      setError(err.message || 'Error obtenint estadístiques');
      toast.error('Error carregant les estadístiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstadistiques();
  }, [user, isAdmin]);

  return {
    estadistiques,
    loading,
    error,
    refetch: fetchEstadistiques,
  };
}