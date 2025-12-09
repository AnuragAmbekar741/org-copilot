import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  createScenarioApi,
  getScenariosApi,
  getScenarioByIdApi,
  deleteScenarioApi,
  type CreateScenarioPayload,
  type ScenarioResponse,
} from "@/api/scenario";
import {
  createFinancialItemApi,
  type CreateFinancialItemPayload,
} from "@/api/financial-item";
import { previewScenarioFromPromptApi } from "@/api/ai";

export const useCreateScenario = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: CreateScenarioPayload) => {
      const data = await createScenarioApi(payload);
      return data;
    },
    onSuccess: (data: ScenarioResponse) => {
      if (data?.success && data?.data?.id) {
        toast.success("Scenario created!", {
          description: "Your scenario has been initialized successfully.",
          duration: 3000,
        });
        navigate(`/dashboard/scenario/${data.data.id}`, { replace: true });
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to create scenario", {
        description:
          error.message || "An error occurred while creating the scenario.",
        duration: 4000,
      });
    },
  });
};

export const useScenarios = () => {
  return useQuery({
    queryKey: ["scenarios"],
    queryFn: getScenariosApi,
  });
};

export const useScenario = (id: string | undefined) => {
  return useQuery({
    queryKey: ["scenario", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Scenario ID is required");
      }
      return getScenarioByIdApi(id);
    },
    enabled: !!id,
  });
};

export const useCreateFinancialItem = (scenarioId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateFinancialItemPayload) => {
      const data = await createFinancialItemApi(scenarioId, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scenario", scenarioId] });
      toast.success("Item added!", {
        description: "Financial item has been added to the scenario.",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to add item", {
        description:
          error.message || "An error occurred while adding the item.",
        duration: 4000,
      });
    },
  });
};

export const usePreviewScenarioFromPrompt = () => {
  return useMutation({
    mutationFn: async (prompt: string) => {
      const data = await previewScenarioFromPromptApi(prompt);
      return data;
    },
    onError: (error: Error) => {
      toast.error("Failed to preview scenario", {
        description:
          error.message || "An error occurred while previewing the scenario.",
        duration: 4000,
      });
    },
  });
};

export const useDeleteScenario = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id: string) => deleteScenarioApi(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["scenarios"] });
      queryClient.removeQueries({ queryKey: ["scenario", id] });
      toast.success("Scenario deleted", {
        description: "Scenario removed successfully.",
        duration: 3000,
      });
      navigate("/dashboard/home", { replace: true });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete scenario", {
        description:
          error.message || "An error occurred while deleting the scenario.",
        duration: 4000,
      });
    },
  });
};
