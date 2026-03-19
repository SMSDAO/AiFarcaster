// lib/ai/optimizer.ts
// AI Prompt Optimizer with a model fallback chain.
// Primary: gpt-4-turbo | Fallback: gpt-3.5-turbo | Last resort: structured default.
import 'server-only';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to rewrite the user's prompt \
to make it clearer, more specific, and more effective for AI models. \
Preserve the original intent while improving structure, clarity, and completeness. \
Return ONLY the improved prompt text – no preamble, no explanation.`;

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

/**
 * Attempts to call the OpenAI chat completions endpoint with `model`.
 * Returns the optimized prompt string or null on failure.
 */
async function tryOptimize(
  client: OpenAI,
  model: string,
  input: string,
): Promise<string | null> {
  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: input },
      ],
      max_tokens: 1024,
      temperature: 0.3,
    });
    const text = completion.choices[0]?.message?.content?.trim();
    return text ?? null;
  } catch {
    return null;
  }
}

export interface OptimizeResult {
  optimized: string;
  model: string;
  fallback: boolean;
}

/**
 * Optimizes a prompt using a cascading model chain:
 *   gpt-4-turbo → gpt-3.5-turbo → structured default
 *
 * Never throws – always returns a usable result.
 */
export async function optimizePrompt(input: string): Promise<OptimizeResult> {
  const client = getOpenAIClient();

  if (client) {
    // Primary model
    const primary = await tryOptimize(client, 'gpt-4-turbo', input);
    if (primary) {
      return { optimized: primary, model: 'gpt-4-turbo', fallback: false };
    }

    // Fallback model
    const fallback = await tryOptimize(client, 'gpt-3.5-turbo', input);
    if (fallback) {
      return { optimized: fallback, model: 'gpt-3.5-turbo', fallback: true };
    }
  }

  // Last resort: return a structured version of the original prompt
  const structured = buildStructuredDefault(input);
  return { optimized: structured, model: 'default', fallback: true };
}

/**
 * Produces a minimally improved version of `input` without any external call.
 * Trims whitespace, normalises capitalisation, and appends a clarity directive.
 */
function buildStructuredDefault(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return 'Please describe your request in detail.';
  }
  const sentence =
    trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  const withPeriod = sentence.endsWith('.') ? sentence : `${sentence}.`;
  return `${withPeriod} Please be specific and detailed in your response.`;
}
