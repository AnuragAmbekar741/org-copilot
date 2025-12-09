import { post } from "@/utils/request";
import { type CreateScenarioPayload } from "./scenario";

export type PreviewScenarioResponse = {
  success: boolean;
  data: CreateScenarioPayload;
};

export const previewScenarioFromPromptApi = async (prompt: string) => {
  const data = await post<PreviewScenarioResponse, { prompt: string }>(
    "/scenarios/preview",
    { prompt }
  );
  return data;
};
