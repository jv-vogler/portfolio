---
goal: Refactor CommandPalette keyboard handling to use @tanstack/react-hotkeys and add global hotkeys for theme and language toggling with hints in the palette
version: 1.0
date_created: 2026-03-03
last_updated: 2026-03-03
owner: jvogler
status: "Planned"
tags: [feature, refactor, hotkeys, ux]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Replaces the manual `useEffect`/`addEventListener` keyboard shortcut pattern in `CommandPaletteProvider` with `@tanstack/react-hotkeys`'s `useHotkey` hook. Additionally adds two new global shortcuts — theme toggle (`Mod+Shift+T`) and language toggle (`Mod+Shift+L`) — and surfaces all shortcut hints inside the `CommandPalette` actions group using `formatForDisplay`.

## 1. Requirements & Constraints

- **REQ-001**: Replace the raw `window.addEventListener('keydown', ...)` handler in `CommandPaletteProvider` with `useHotkey('Mod+K', toggle)` from `@tanstack/react-hotkeys`.
- **REQ-002**: Add a global hotkey `Mod+Shift+T` that toggles the theme (dark ↔ light) from the provider level.
- **REQ-003**: Add a global hotkey `Mod+Shift+L` that switches the locale (en ↔ pt) from the provider level.
- **REQ-004**: Theme and locale hotkey logic must be lifted into `CommandPaletteProvider` so all three hotkeys are registered in one place.
- **REQ-005**: Display `formatForDisplay` hint badges next to the three action `CommandItem`s inside `CommandPalette`: open search (`Mod+K`), toggle theme (`Mod+Shift+T`), toggle language (`Mod+Shift+L`).
- **CON-001**: `@tanstack/react-hotkeys` is already installed (`pnpm i @tanstack/react-hotkeys` was run). No new dependencies needed.
- **CON-002**: Do not break existing `CommandPalette` props interface (`open`, `onOpenChange`, `posts`).
- **PAT-001**: `Mod` resolves to `⌘` on macOS and `Ctrl` on Windows/Linux automatically via `formatForDisplay`.
- **GUD-001**: Hotkey hint badges should use a `<kbd>` element styled consistently with the existing palette UI (small, muted, monospace).

## 2. Implementation Steps

### Implementation Phase 1 — Refactor `CommandPaletteProvider`

- GOAL-001: Remove manual `useEffect` keyboard listener, register all three global hotkeys via `useHotkey`, and expose theme/locale actions through the context (or handle them internally with `next-themes` and `next-intl` routing).

| Task     | Description                                                                                                                                                                                              | Completed | Date |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-001 | In `src/ui/components/CommandPaletteProvider.tsx`: remove `useEffect` + `window.addEventListener` block and the `toggle` dependency array.                                                               |           |      |
| TASK-002 | Add imports: `useHotkey` from `'@tanstack/react-hotkeys'`, `useTheme` from `'next-themes'`, `useRouter` from `'@/i18n/routing'`, `useLocale` from `'next-intl'`, `usePathname` from `'@/i18n/routing'`.  |           |      |
| TASK-003 | Inside `CommandPaletteProvider`: obtain `setTheme` + `theme` from `useTheme()`, `locale` from `useLocale()`, `pathname` from `usePathname()`, and `router` from `useRouter()`.                           |           |      |
| TASK-004 | Register `useHotkey('Mod+K', toggle)` — replaces deleted `useEffect`.                                                                                                                                    |           |      |
| TASK-005 | Create `toggleTheme` callback: `useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [setTheme, theme])`. Register `useHotkey('Mod+Shift+T', toggleTheme)`.                                  |           |      |
| TASK-006 | Create `toggleLocale` callback: `useCallback(() => router.replace(pathname, { locale: locale === 'en' ? 'pt' : 'en' }), [router, pathname, locale])`. Register `useHotkey('Mod+Shift+L', toggleLocale)`. |           |      |
| TASK-007 | Expand `CommandPaletteContextValue` to include `toggleTheme: () => void` and `toggleLocale: () => void`, and provide them via `CommandPaletteContext.Provider value`.                                    |           |      |
| TASK-008 | Pass `onToggleTheme={toggleTheme}` and `onToggleLocale={toggleLocale}` as props to the `<CommandPalette />` render inside the provider so the palette can call them via `handleSelect`.                  |           |      |

### Implementation Phase 2 — Update `CommandPalette` component

- GOAL-002: Replace the existing inline `setTheme`/`router.push` calls in the actions group with the new props, and add `formatForDisplay` hint badges to the three action items.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                             | Completed | Date |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-009 | In `src/ui/components/CommandPalette.tsx`: add `onToggleTheme: () => void` and `onToggleLocale: () => void` to `CommandPaletteProps` type.                                                                                                                                                                                                                                                                              |           |      |
| TASK-010 | Add import: `formatForDisplay` from `'@tanstack/react-hotkeys'`.                                                                                                                                                                                                                                                                                                                                                        |           |      |
| TASK-011 | Remove `useTheme`, `useRouter`, and `useLocale` hook calls from `CommandPalette` (they are no longer needed here; theme/locale actions are delegated to the two new props). Keep `useRouter`/`useLocale` only if still needed for `navigateTo`; inspection shows `navigateTo` uses both — keep them but remove the `setTheme`/`theme` destructure from `useTheme` and the locale-change `router.push` call in the item. |           |      |
| TASK-012 | Update the "Toggle Theme" `CommandItem` `onSelect` to `() => handleSelect(onToggleTheme)`.                                                                                                                                                                                                                                                                                                                              |           |      |
| TASK-013 | Update the "Toggle Language" `CommandItem` `onSelect` to `() => handleSelect(onToggleLocale)`.                                                                                                                                                                                                                                                                                                                          |           |      |
| TASK-014 | Add a `<kbd>` shortcut hint to the "Toggle Theme" `CommandItem` children: `<kbd className="ml-auto text-xs text-muted-foreground font-mono">{formatForDisplay('Mod+Shift+T')}</kbd>`.                                                                                                                                                                                                                                   |           |      |
| TASK-015 | Add a `<kbd>` shortcut hint to the "Toggle Language" `CommandItem` children: `<kbd className="ml-auto text-xs text-muted-foreground font-mono">{formatForDisplay('Mod+Shift+L')}</kbd>`.                                                                                                                                                                                                                                |           |      |
| TASK-016 | Locate the existing `⌘K` / `Ctrl K` hint that is currently displayed inside the palette trigger area (the `CommandInput` footer or `CommandDialog` built-in shortcut element). If the hint is rendered inline in the palette header or via `CommandDialog`'s built-in kbd, confirm it already shows correctly; otherwise add `<kbd>{formatForDisplay('Mod+K')}</kbd>` next to the input placeholder label.              |           |      |

### Implementation Phase 3 — Validation

- GOAL-003: Verify all three hotkeys fire correctly and that hints render properly.

| Task     | Description                                                                                                                                                                                                                     | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-017 | Run `pnpm dev` and confirm `Mod+K` opens/closes the command palette without console errors.                                                                                                                                     |           |      |
| TASK-018 | Confirm `Mod+Shift+T` toggles theme while the palette is closed and while it is open (should not fire when an input is focused per TanStack Hotkeys defaults — verify this does not conflict with typing in the command input). |           |      |
| TASK-019 | Confirm `Mod+Shift+L` switches locale (en ↔ pt) and page re-renders to the correct locale.                                                                                                                                      |           |      |
| TASK-020 | Visually verify that theme and language `CommandItem`s display formatted shortcut `<kbd>` badges.                                                                                                                               |           |      |
| TASK-021 | Run `pnpm build` (or `pnpm lint`) to confirm no TypeScript or linting errors are introduced.                                                                                                                                    |           |      |

## 3. Alternatives

- **ALT-001**: Keep hotkeys for theme/locale in their respective components (`ThemeToggle`, `LocaleSwitcher`) rather than lifting to the provider. Rejected because it scatters hotkey definitions across the codebase and makes it harder to show hints in a centralized palette.
- **ALT-002**: Use a different hotkey library (e.g., `react-hotkeys-hook`). Rejected because the user explicitly requested `@tanstack/react-hotkeys`, which is already installed.
- **ALT-003**: Expose `toggleTheme`/`toggleLocale` only through the context (not as props to `CommandPalette`). Rejected because `CommandPalette` already closes the palette before calling the action via `handleSelect`, which requires having a callback reference; passing as props keeps the component self-contained.

## 4. Dependencies

- **DEP-001**: `@tanstack/react-hotkeys` — already installed.
- **DEP-002**: `next-themes` — already used in `CommandPalette`; will also be used in provider.
- **DEP-003**: `next-intl` `useLocale`, `@/i18n/routing` `useRouter`/`usePathname` — already used in `LocaleSwitcher`; will be used in provider.

## 5. Files

- **FILE-001**: `src/ui/components/CommandPaletteProvider.tsx` — primary change: replace `useEffect` kbd listener with `useHotkey`; add theme/locale hotkeys; expand context value type.
- **FILE-002**: `src/ui/components/CommandPalette.tsx` — add `onToggleTheme`/`onToggleLocale` props; add `formatForDisplay` shortcut badges to action items.

## 6. Testing

- **TEST-001**: Manual — `Mod+K` opens/closes command palette on both macOS and Linux/Windows.
- **TEST-002**: Manual — `Mod+Shift+T` toggles dark/light theme globally.
- **TEST-003**: Manual — `Mod+Shift+L` switches locale and the URL/content updates correctly.
- **TEST-004**: Visual — `CommandPalette` action items display the correct platform-formatted shortcut badges (e.g., `⌘⇧T` on Mac, `Ctrl+Shift+T` on Windows).
- **TEST-005**: TypeScript — `pnpm build` exits with code 0 (no type errors).

## 7. Risks & Assumptions

- **RISK-001**: `@tanstack/react-hotkeys` is in alpha; the API may change in future versions. Pin the version in `package.json` if needed.
- **RISK-002**: `useHotkey` by default ignores hotkeys when an `<input>` is focused. Since `CommandDialog` renders an `<input>`, `Mod+Shift+T` and `Mod+Shift+L` will be silently swallowed while typing in the palette. This is acceptable UX (users shouldn't switch theme mid-search) but should be explicitly tested (TASK-018).
- **ASSUMPTION-001**: The `CommandDialog` from shadcn/ui does not register its own `Mod+K` listener (the existing provider already owns that responsibility).
- **ASSUMPTION-002**: `router.replace(pathname, { locale })` in the provider correctly uses the current pathname from `usePathname()` and processes the locale swap without full-page reload (consistent with how `LocaleSwitcher` works).

## 8. Related Specifications / Further Reading

- [TanStack Hotkeys Quick Start](https://tanstack.com/hotkeys/latest/docs/framework/react/quick-start)
- [TanStack Hotkeys Formatting & Display Guide](https://tanstack.com/hotkeys/latest/docs/framework/react/guides/formatting-display)
- [plan/feature-payloadcms-integration-1.md](feature-payloadcms-integration-1.md)
