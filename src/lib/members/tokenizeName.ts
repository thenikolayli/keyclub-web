// Creates lowercased tokens from a name string.
// tokenizeName('John "Johny" keyCLUB') -> ['john', 'johny', 'keyclub']
export function tokenizeName(name: string): string[] {
  return name.trim().replaceAll(`"`, ``).toLowerCase().split(' ');
}

// Mirrors the match_all_tokens supabase RPC semantics: returns true when every
// token of tokens is present in candidateTokens.
// match_all_tokens is the custom RPC function that you can look at in the
// supabase dashboard on the supabase website.
export function matchesAllTokens(tokens: string[], candidateTokens: string[]): boolean {
  return tokens.every((t) => candidateTokens.includes(t));
}
