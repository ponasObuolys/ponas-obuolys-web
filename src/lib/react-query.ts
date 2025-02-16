import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Duomenys bus laikomi cache 5 minutes
      staleTime: 5 * 60 * 1000,
      // Automatiškai atnaujinti duomenis kas 10 minučių
      refetchInterval: 10 * 60 * 1000,
      // Bandyti iš naujo 3 kartus jei užklausa nepavyko
      retry: 3,
      // Rodyti senus duomenis kol gaunami nauji
      keepPreviousData: true,
      // Išsaugoti duomenis cache 30 minučių
      cacheTime: 30 * 60 * 1000,
      // Atnaujinti duomenis kai langas vėl tampa aktyvus
      refetchOnWindowFocus: true,
      // Atnaujinti duomenis kai prisijungimas atsistato
      refetchOnReconnect: true,
    },
    mutations: {
      // Bandyti iš naujo 2 kartus jei mutacija nepavyko
      retry: 2,
    },
  },
});

// Custom hooks for common data fetching patterns
export const useOptimisticUpdate = () => {
  return {
    // Optimistinis atnaujinimas - parodyti pakeitimus iš karto, net jei serverio atsakymo dar nėra
    optimisticUpdate: (queryKey: unknown[], updater: (old: any) => any) => {
      queryClient.setQueryData(queryKey, updater);
    },
    // Atšaukti optimistinį atnaujinimą jei įvyko klaida
    rollback: (queryKey: unknown[]) => {
      queryClient.invalidateQueries(queryKey);
    },
  };
}; 