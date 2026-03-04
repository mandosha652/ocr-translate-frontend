# imgtext-frontend — Full Refactoring Plan

## Status

- Phase 1: ✅ Complete (types, constants, utils, shared hooks, PasswordInput all exist)
- Phase 2: ✅ Complete (correctness bugs fixed, hooks split, pages slimmed)
- Phase 3: ✅ Complete
- Phase 4: Not started
- Phase 5: Not started

---

## Phase 3 Status (Container / Presenter Split)

### Done ✅

- 3.1 batch/page.tsx → BatchFormCard.tsx + ActiveBatchesPanel.tsx
- 3.2 translate/page.tsx → TranslateFormCard, TranslateProgressCard, TranslateResultPanel
- 3.3 settings/page.tsx → AccountInfoCard, ChangePasswordCard, DangerZoneCard (self-contained)
- 3.4 history/page.tsx → HistorySearch, SingleHistoryTab, BatchHistoryTab
- 3.5 dashboard/page.tsx → WelcomeHeader, StatsGrid, TopLanguagesCard
- 3.6 useAuth.ts → 5 sub-hooks (hooks/auth/) + facade
- 3.7 useTranslate.ts → hooks/batch/ + hooks/translate/ (deleted)
- 3.8 useAdmin.ts → hooks/admin/ (deleted), adminEnabled helper

### In progress / not done ❌

- 3.9 admin/page.tsx (410 lines) — extract CostSection component
- 3.10 admin/users/page.tsx (292 lines) — UserRow, UserRowSkeleton, CreateUserDialog extracted ✅ (done in last session)
- 3.11 admin/batches/page.tsx (462 lines) — extract StatusBadge, BatchRow, BatchRowSkeleton
- 3.12 admin/batches/[id]/page.tsx (525 lines) — extract InfoRow usage, STATUS_CONFIG, IMAGE_STATUS_CONFIG, image list
- 3.13 admin/users/[id]/page.tsx (662 lines) — extract UserActionsPanel, ApiKeyList; replace local TIER_STYLES/AVATAR_COLORS/InfoRow with imports from shared
- 3.14 batch/[id]/page.tsx (346 lines) — extract BatchDetailContent into \_components/

---

## Phase 4 Status (Design Patterns)

### Not started ❌

- 4.1 Compound Component for ApiKeysCard (28 props → 0)
- 4.2 Decompose DashboardNav.tsx (298 lines → folder)
- 4.3 Refactor AdminNav + AdminAuthGate (shared useAdminLogout, shared LogoutDialog)
- 4.4 Config-driven WelcomeModal + OnboardingChecklist (move SLIDES/STEPS to src/config/onboarding.ts)
- 4.5 Replace 4× duplicate downloadBlob with useDownloadBlob
- 4.6 Replace 3× duplicate useCopyToClipboard
- 4.7 Shared BATCH_STATUS_CONFIG (covers BatchProgress, BatchCard, BatchStatusCard, batch/[id]/page statusConfig, admin/batches/[id] STATUS_CONFIG = 5 files total)
- 4.8 Apply useCollapsible to BatchCard and SingleCard

---

## Phase 5 Status (Accessibility + Polish)

### Not started ❌

- 5.1 aria-expanded/aria-controls on collapsible elements
- 5.2 aria-label on icon-only buttons
- 5.3 Standardise <Button> usage (replace raw <button> in history cards)
- 5.4 Fix TYPE_COLORS Tailwind purge risk in NotificationBell.tsx
- 5.5 Apply <PasswordInput> across auth pages (login, signup, reset-password, ChangePasswordCard)
- 5.6 Consolidate date utilities (api-keys-card local fns → src/lib/utils/date.ts)
- 5.7 Sentry config: reduce tracesSampleRate from 1 → 0.1 in sentry.server.config.ts + sentry.edge.config.ts

---

## Audit Additions (missed in original plan, confirmed in second audit)

### Already implemented before second audit ✅

- src/lib/constants/admin.ts — TIER_STYLES, AVATAR_COLORS, avatarColor(), fmt(), ADMIN_STATUS_CONFIG
- src/components/admin/InfoRow.tsx — shared InfoRow component (14 lines)
- src/lib/validators/password.ts — getPasswordStrength()

### What the pages still do wrong (not yet fixed)

**admin/users/[id]/page.tsx (662 lines)**

- Local TIER_STYLES, AVATAR_COLORS, avatarColor() — duplicates from constants/admin.ts → replace with imports
- Local InfoRow (lines 90–108) with icon prop variant — duplicates shared InfoRow (which lacks icon) → extend shared InfoRow to accept optional icon prop, then import
- UserActionsPanel (176 lines, 8 responsibilities) — extract to \_components/UserActionsPanel.tsx
- ApiKeyList (inline in page, lines 579–656) — extract to \_components/ApiKeyList.tsx

**admin/batches/[id]/page.tsx (525 lines)**

- STATUS_CONFIG (lines 45–84) — same shape as admin/batches/page.tsx STATUS_CONFIG → move to constants/admin.ts as ADMIN_BATCH_STATUS_CONFIG
- IMAGE_STATUS_CONFIG (lines 86–101) — move to constants/admin.ts
- Local InfoRow (lines 112–130) — replace with shared InfoRow import
- Inline image list (lines 464–519) — extract to \_components/BatchImageList.tsx

**admin/batches/page.tsx (462 lines)**

- STATUS_CONFIG (lines 52–82) — duplicate of batches/[id] STATUS_CONFIG → both replaced by ADMIN_BATCH_STATUS_CONFIG from constants/admin.ts
- BatchRow (lines 93–258) — extract to \_components/BatchRow.tsx (needed for 3.11)
- BatchRowSkeleton + StatusBadge — same file

**batch/[id]/page.tsx (346 lines)**

- statusConfig (lines 31–44) — 4th copy of batch status map → part of 4.7 BATCH_STATUS_CONFIG consolidation
- BatchDetailContent (276 lines) — extract to \_components/BatchDetailContent.tsx

**admin/page.tsx (410 lines)**

- Cost section (period picker + 4 cost cards + user costs table, ~180 lines) → extract to \_components/CostSection.tsx
- fmt() used inline — import from constants/admin.ts (it's already there with 4dp, page uses 2dp fmt — reconcile)

**Note on fmt()**: admin/page.tsx has a local `fmt` returning `$${val.toFixed(2)}` (2dp) while constants/admin.ts has `fmt` returning `$${val.toFixed(4)}` (4dp). These serve different contexts (overview vs. cost detail). Rename: constants/admin.ts → `fmtCost` (4dp), admin/page.tsx local → `fmtUSD` (2dp), extracted to CostSection.

---

## Remaining Work Ordered by Dependencies

### Must do before Phase 4

**Step A — Extend shared InfoRow with icon prop** (prerequisite for 3.12, 3.13)

- Edit `src/components/admin/InfoRow.tsx` to add optional `icon?: React.ElementType` prop

**Step B — Add to constants/admin.ts** (prerequisite for 3.11, 3.12)

- Add `ADMIN_BATCH_STATUS_CONFIG` (merges STATUS_CONFIG from both batches pages)
- Add `ADMIN_IMAGE_STATUS_CONFIG` (from batches/[id] page)

**Step C — 3.11: admin/batches/page.tsx**

- Create `_components/StatusBadge.tsx` (uses ADMIN_BATCH_STATUS_CONFIG)
- Create `_components/BatchRow.tsx` (imports StatusBadge)
- Create `_components/BatchRowSkeleton.tsx`
- Slim page.tsx to ~80 lines

**Step D — 3.12: admin/batches/[id]/page.tsx**

- Create `_components/BatchImageList.tsx`
- Replace local STATUS_CONFIG/IMAGE_STATUS_CONFIG/InfoRow with imports
- Slim page.tsx

**Step E — 3.13: admin/users/[id]/page.tsx**

- Create `_components/UserActionsPanel.tsx`
- Create `_components/ApiKeyList.tsx`
- Replace local TIER_STYLES/AVATAR_COLORS/avatarColor/InfoRow with imports
- Slim page.tsx

**Step F — 3.14: batch/[id]/page.tsx**

- Create `_components/BatchDetailContent.tsx`
- Slim page.tsx

**Step G — 3.9: admin/page.tsx**

- Create `_components/CostSection.tsx` (uses fmtUSD, renders period picker + cards + user table)
- Slim page.tsx

### Then Phase 4

- 4.7 first (BATCH_STATUS_CONFIG consolidation — needed by 4.2, 5.4)
- 4.2 DashboardNav decomposition
- 4.1 ApiKeysCard compound component
- 4.3 AdminNav/AdminAuthGate
- 4.4 onboarding config
- 4.5 useDownloadBlob
- 4.6 useCopyToClipboard
- 4.8 useCollapsible

### Then Phase 5

- 5.5 PasswordInput adoption
- 5.1/5.2 Accessibility
- 5.3 Button standardisation
- 5.4 NotificationBell Tailwind safelist
- 5.6 Date utils consolidation
- 5.7 Sentry config

---

## Key Files — Do Not Touch

- src/lib/api/client.ts (hardened 401 refresh queue)
- src/lib/api/auth.ts, translate.ts, admin.ts, team.ts
- src/hooks/useBatchStream.ts, useUsageStats.ts, useTeam.ts
- src/components/features/translate/ImageUploader.tsx, ZoomableImage.tsx, LanguageSelect.tsx
- src/components/ui/ (all shadcn)
- src/lib/validators/ (Zod schemas)
- src/providers/, src/config/env.ts
- e2e/

---

## Typecheck Rule

After every file change: `yarn typecheck` must pass before moving to next step.
