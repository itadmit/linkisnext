/**
 * A/B Testing utilities
 */

/**
 * Generates a variant ID for A/B testing
 */
export function getVariant(userId: string, testName: string, variants: string[]): string {
  // Simple hash-based variant selection
  const hash = hashString(`${userId}-${testName}`);
  const index = hash % variants.length;
  return variants[index];
}

/**
 * Simple string hash function
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Tracks A/B test conversion
 */
export async function trackConversion(
  userId: string,
  testName: string,
  variant: string,
  conversionType: string
): Promise<void> {
  try {
    await fetch("/api/ab-testing/conversion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        testName,
        variant,
        conversionType,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Failed to track A/B test conversion:", error);
  }
}

/**
 * A/B Test configuration
 */
export interface ABTestConfig {
  name: string;
  variants: string[];
  enabled: boolean;
}

/**
 * Default A/B tests
 */
export const DEFAULT_AB_TESTS: ABTestConfig[] = [
  {
    name: "button_color",
    variants: ["blue", "purple", "green"],
    enabled: false,
  },
  {
    name: "cta_text",
    variants: ["default", "short", "emphasized"],
    enabled: false,
  },
];

