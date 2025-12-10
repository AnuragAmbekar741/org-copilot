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
4. Include funding as a "one_time" "revenue" item (NOT cost)
5. Include recurring revenue (like ARR) as monthly revenue items
6. Use today's date (${today}) as the start date for all items unless specified otherwise
7. Create a concise title (max 2-3 words) and detailed description
8. Ensure all values are in dollars (convert from millions, thousands, etc.)
9. Include standard operational costs if not mentioned (e.g., cloud infrastructure, tools, office space)
10. Name team members simply (e.g., "Engineer 1", "Sales Rep 1") WITHOUT including salary in the title
11. Provide timelineLength as a positive integer number of timeline columns (e.g., months). Default to 12 if not obvious, but ensure it covers the latest startsAt/endsAt of all items.
12. IMPORTANT: For revenue that GROWS or CHANGES over time (like MRR projections), do NOT stack values. Use endsAt to mark when one revenue phase ends before the next begins. Example: "MRR is $15k now, grows to $35k by month 6" means:
    - "Current MRR" $15k/month, startsAt: 0, endsAt: 5 (ends before month 6)
    - "Growth MRR" $35k/month, startsAt: 6, endsAt: null (ongoing)
    Revenue should REPLACE, not ADD when it "grows".

Example conversions:
- "1M funding" = $1,000,000 one-time revenue (Category: Funding)
- "50k ARR" = $50,000 monthly revenue (or $4,167 monthly if annual)
- "3 engineers at 150k each" = 3 items titled "Engineer 1", "Engineer 2", "Engineer 3" with $12,500 monthly cost
- "150k salary" = $12,500 monthly cost
- "MRR $15k growing to $35k by month 6" = Two items: MRR $15k (startsAt:0, endsAt:5), MRR $35k (startsAt:6, endsAt:null)

Return a structured response matching the CreateScenarioDto type with title, optional description, and optional financialItems array.`;

  const humanPrompt = `User's scenario description:
{userPrompt}

Analyze this description and create a complete financial scenario. Make sure to:
- Extract all financial figures mentioned
- Break down team costs into individual items
- Include appropriate categories
- Set appropriate frequencies (monthly for salaries/recurring revenue, one_time for funding)
- Treat funding as REVENUE (one_time)
- startsAt is a 0-based month index (0 = first month, 1 = second month, etc.)
- Items that start immediately should have startsAt: 0
- Items that start next month should have startsAt: 1
- Create a short title (max 2-3 words) and description
- Set timelineLength to a positive integer that covers the span of the scenario (default to 12 if not specified)`;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", humanPrompt],
  ]);

  try {
    const result = (await structuredModel.invoke(
      await prompt.format({ userPrompt })
    )) as any;

    // Transform null values to undefined to match CreateScenarioDto
    const scenario: CreateScenarioDto = {
      title: result.title,
      description: result.description ?? undefined,
      financialItems: result.financialItems?.map((item: any) => ({
        title: item.title,
        category: item.category,
        type: item.type,
        value: item.value,
        frequency: item.frequency,
        startsAt: item.startsAt || 1,
        endsAt: item.endsAt ?? undefined,
      })),
      timelineLength: result.timelineLength ?? 12,
    };
    return scenario;
  } catch (error) {
    console.error("Error generating scenario:", error);
    throw new Error(
      `Failed to generate scenario: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
