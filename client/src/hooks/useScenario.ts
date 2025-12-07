import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  createScenarioApi,
  getScenariosApi,
  getScenarioByIdApi,
  type CreateScenarioPayload,
  type ScenarioResponse,
} from "@/api/scenario";

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
