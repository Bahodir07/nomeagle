/* ==========================================================================
   Learning Countries — localStorage persistence
   When user clicks "Learn" on Search page, country code is added here.
   Dashboard reads this list to show "My Learning Countries".
   ========================================================================== */

const STORAGE_KEY = 'ne.learningCountryCodes';

export function getLearningCountryCodes(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

export function addLearningCountry(code: string): void {
  const codes = getLearningCountryCodes();
  const normalized = code.toLowerCase().trim();
  if (!normalized || codes.includes(normalized)) return;
  codes.push(normalized);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
  } catch {
    // localStorage full or disabled
  }
}

export function removeLearningCountry(code: string): void {
  const codes = getLearningCountryCodes().filter(
    (c) => c !== code.toLowerCase().trim()
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
  } catch {
    // ignore
  }
}

export function isLearningCountry(code: string): boolean {
  return getLearningCountryCodes().includes(code.toLowerCase().trim());
}
