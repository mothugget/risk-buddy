import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { factorsApi } from "@/lib/api";
import type { CreateFactorInput, UpdateFactorInput } from "@/types";
import { toast } from "@/hooks/use-toast";

export function useFactors() {
  return useQuery({
    queryKey: ["factors"],
    queryFn: factorsApi.getAll,
  });
}

export function useCreateFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFactorInput) => factorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factors"] });
      toast({ title: "Factor created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating factor", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFactorInput }) =>
      factorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factors"] });
      toast({ title: "Factor updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating factor", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => factorsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factors"] });
      toast({ title: "Factor deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting factor", description: error.message, variant: "destructive" });
    },
  });
}
