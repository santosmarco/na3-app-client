import { FB_MSG_TOKENS_STORAGE_KEY } from "@config";

export function storeMessagingToken(token: string): void {
  const storedTokensStr = localStorage.getItem(FB_MSG_TOKENS_STORAGE_KEY);

  if (!storedTokensStr) {
    localStorage.setItem(FB_MSG_TOKENS_STORAGE_KEY, JSON.stringify([token]));
  } else {
    localStorage.setItem(
      FB_MSG_TOKENS_STORAGE_KEY,
      JSON.stringify([...(JSON.parse(storedTokensStr) as Array<string>), token])
    );
  }
}

export function getStoredMessagingTokens(): string[] {
  const storedTokensStr = localStorage.getItem(FB_MSG_TOKENS_STORAGE_KEY);

  if (!storedTokensStr) {
    return [];
  }
  return JSON.parse(storedTokensStr) as Array<string>;
}
