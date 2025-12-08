import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CreateScenarioDto } from "../types/scenario";
import { createScenarioSchema } from "../types/zod-scenario";

// Initialize the OpenAI model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Create model with structured output using schema from types
const structuredModel = model.withStructuredOutput(createScenarioSchema);

export const generateScenarioFromPrompt = async (
  userPrompt: string
): Promise<CreateScenarioDto> => {
  const today = new Date().toISOString().split("T")[0];

  const systemPrompt = `You are a financial planning expert. Your task is to analyze a user's natural language description of their business scenario and create a comprehensive financial scenario with all relevant financial items.

Key guidelines:
1. Extract all mentioned financial information (funding, revenue, costs, team salaries, etc.)
2. Break down costs into logical categories (Engineering, Sales, Marketing, Operations, Infrastructure)
3. For team members, calculate monthly costs (annual salary / 12)
4. Include one-time costs (like funding) as "one_time" frequency
5. Include recurring revenue (like ARR) as monthly revenue items
6. Use today's date (${today}) as the start date for all items unless specified otherwise
7. Create a professional, descriptive title and detailed description
8. Ensure all values are in dollars (convert from millions, thousands, etc.)
9. Include standard operational costs if not mentioned (e.g., cloud infrastructure, tools, office space)

Example conversions:
- "1M funding" = $1,000,000 one-time cost
- "50k ARR" = $50,000 monthly revenue (or $4,167 monthly if annual)
- "3 engineers at 150k each" = 3 items of $12,500 monthly cost each (150k/12)
- "150k salary" = $12,500 monthly cost

Return a structured response matching the CreateScenarioDto type with title, optional description, and optional financialItems array.`;

  const humanPrompt = `User's scenario description:
{userPrompt}

Analyze this description and create a complete financial scenario. Make sure to:
- Extract all financial figures mentioned
- Break down team costs into individual items
- Include appropriate categories
- Set appropriate frequencies (monthly for salaries/recurring revenue, one_time for funding)
- Use today's date (${today}) for startsAt
- Create a professional title and description`;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", humanPrompt],
  ]);

  try {
    const result = await structuredModel.invoke(
      await prompt.format({ userPrompt })
    );
    return result;
  } catch (error) {
    console.error("Error generating scenario:", error);
    throw new Error(
      `Failed to generate scenario: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
