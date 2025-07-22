import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { StudySessionWithDetails } from "@shared/schema";

export function useStudySessions() {
  return useQuery<StudySessionWithDetails[]>({
    queryKey: ["/api/study-sessions"],
    queryFn: async () => {
      const response = await api.studySessions.getAll();
      return response.json();
    },
  });
}

export function useTodaysStudySessions() {
  return useQuery<StudySessionWithDetails[]>({
    queryKey: ["/api/study-sessions/today"],
    queryFn: async () => {
      const response = await api.studySessions.getToday();
      return response.json();
    },
  });
}

export function useCreateStudySession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (session: any) => {
      const response = await api.studySessions.create(session);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/study-sessions/today"] });
      toast({
        title: "Success",
        description: "Study session created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create study session",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateStudySession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, session }: { id: number; session: any }) => {
      const response = await api.studySessions.update(id, session);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/study-sessions/today"] });
      toast({
        title: "Success",
        description: "Study session updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update study session",
        variant: "destructive",
      });
    },
  });
}
