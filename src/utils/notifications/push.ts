export const MSG_TOKENS_STORAGE_KEY = "NA3_APP_MESSAGING_TOKENS";

export function storeMessagingToken(token: string): void {
  const storedTokensStr = localStorage.getItem(MSG_TOKENS_STORAGE_KEY);

  if (!storedTokensStr) {
    localStorage.setItem(MSG_TOKENS_STORAGE_KEY, JSON.stringify([token]));
  } else {
    localStorage.setItem(
      MSG_TOKENS_STORAGE_KEY,
      JSON.stringify([...(JSON.parse(storedTokensStr) as Array<string>), token])
    );
  }
}

export function getStoredMessagingTokens(): string[] {
  const storedTokensStr = localStorage.getItem(MSG_TOKENS_STORAGE_KEY);

  if (!storedTokensStr) {
    return [];
  }
  return JSON.parse(storedTokensStr) as Array<string>;
}
