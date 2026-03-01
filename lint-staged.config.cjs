module.exports = {
  '**/*.{ts,tsx}': () => 'pnpm run typecheck:go',
  '**/*.{ts,tsx,js,jsx,md,json}': 'pnpm exec oxfmt --write',
  '**/*.{ts,tsx,js,jsx}': 'pnpm exec oxlint',
}
