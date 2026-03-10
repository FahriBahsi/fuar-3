import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getListings, getListingBySlug } from '@/lib/api';
import type { ListingFilters, Listing } from '@/types/listing';
import toast from 'react-hot-toast';

/**
 * Hook for fetching listings with filters
 */
export function useListings(filters: ListingFilters = {}) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => getListings(filters),
  });
}

/**
 * Hook for fetching a single listing
 */
export function useListing(slug: string) {
  return useQuery({
    queryKey: ['listing', slug],
    queryFn: () => getListingBySlug(slug),
    enabled: !!slug,
  });
}

/**
 * Hook for creating a new listing (example)
 */
export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listing: Partial<Listing>) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return listing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      toast.success('Listing created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create listing: ${error.message}`);
    },
  });
}

/**
 * Hook for updating a listing (example)
 */
export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Listing> }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id, ...data };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', variables.id] });
      toast.success('Listing updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update listing: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting a listing (example)
 */
export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      toast.success('Listing deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete listing: ${error.message}`);
    },
  });
}

