# Glance – Product Requirements Document

*Project name: Glance · Version 0.2 · Draft · Owner: sarang-cmd · Target platform: Windows 11 (26H2, build 26300.x)*

## 1. Overview

### 1.1 Problem
The default Windows 11 widgets are cluttered with ads, news and suggestions. Turning them off removes the lock screen's usefulness entirely. The owner wants a calm, Apple-quality, ad-free set of lock screen widgets that surface personal statistics, schedule, tasks and habits at a glance, with light interaction.

### 1.2 Vision
A personal, open-source suite of Windows widgets plus a small companion app. The lock screen shows only what matters to the owner: battery and system stats, the day's agenda and top task, and habit progress (water, study, exercise) with a GitHub-style consistency graph.

### 1.3 Goals
- G1. Replace the Microsoft widget feed on the lock screen with useful, ad-free personal widgets.
- G2. Make habit consistency visible: water intake, 2 hours of distraction-free study per day, and weekly sports sessions.
- G3. Provide rich statistics (battery health, system trends, weekly recap) in a clean, Apple-inspired visual style.
- G4. Let the owner choose between one combined card and several separate widgets.
- G5. Give the owner control over what is shown on a locked screen (privacy modes).
- G6. Ship as an open-source project on GitHub that others can build and run.

### 1.4 Non-goals
- Distribution through the Microsoft Store (sideloaded or winget/GitHub releases only for v1).
- Support for Windows 10, macOS or mobile.
- Writing to Google Calendar (read-only for v1).
- Smart-home, public transit, package tracking and uptime monitoring (explicitly declined).
- Cloud sync or accounts of our own; all data stays local.

## 2. User and principles

**Primary user:** a single power user (the owner), a developer on a Windows 11 Home laptop, who wants to improve consistency in hydration, focused study and exercise, and who likes statistics.

**Design principles**
1. **Glanceable:** the key number or state is readable in about one second.
2. **Calm:** no ads, no suggestions, no badges that nag. Reminders are opt-in and quiet.
3. **Apple-like:** generous spacing, rounded forms, a restrained palette, ring and sparkline visuals, clear hierarchy, light and dark support.
4. **Private by default on a locked screen:** the owner decides what a passer-by can read.
5. **Honest data:** if a value is unavailable (for example battery cycle count), show that plainly instead of guessing.

## 3. Platform and technical constraints

- **Widget mechanism:** lock screen widgets are the same widgets as in the Windows Widgets board, which the user can pin to the lock screen. Widgets are built as a packaged app (MSIX) that registers a widget provider through the Windows App SDK, with UI rendered from Adaptive Cards. A plain Win32 exe cannot draw on the lock screen.
- **Distribution:** no Store requirement. For personal use, sideload a signed MSIX with Developer Mode on. For open-source users, publish signed packages through GitHub Releases and winget.
- **Rendering:** Adaptive Cards have limited styling, so rings, graphs and sparklines are rendered by the app as images and embedded in the card.
- **Lifecycle:** the widget provider runs only when Windows requests an update, so history and statistics need a separate background collector and a local database.
- **Unverified assumption (spike required):** how interactive widgets are while the PC is locked (buttons may be unavailable, or may require unlock). See risk R1 and milestone M0.
- **Chosen stack (decided for reliability):** C# with WinUI 3 and the Windows App SDK, chosen for documentation quality and coding-agent compatibility; SQLite for storage.

## 4. Architecture

| Component | Responsibility |
|---|---|
| Widget provider (packaged, MSIX) | Renders Adaptive Cards from the local database; handles button actions where supported |
| Companion app (WinUI 3, tray) | Settings, privacy modes, layout choice, full-year calendar view, habit editing, recap, onboarding |
| Background collector | Samples battery and system metrics, tracks study and exercise sessions, writes to SQLite |
| Integrations | Google Calendar (read-only), Todoist (optional, later), GitHub (contributions), Study with Sarang (study sessions) |
| Notification service | Windows app notifications for water reminders and session prompts, with action buttons |

**Data flow:** collectors and integrations write to SQLite, the widget provider and companion app read from it, and user actions (check-ins, cancellations, timers) write back through the app or widget actions.

## 5. Functional requirements

Priority key: **P0** must have for MVP, **P1** should have, **P2** nice to have.

### 5.1 Core platform (all modules)

- **CORE-1 (P0)** Package the suite as a signed MSIX with at least one registered widget provider, installable via sideloading.
- **CORE-2 (P0)** Local SQLite store for all metrics, habits, events and settings, with a documented schema and migrations.
- **CORE-3 (P0)** Companion app with a settings screen and a tray icon, starting at login.
- **CORE-4 (P0)** **Privacy modes**, selectable globally and per widget: *Full* (everything visible), *Redacted* (titles hidden, for example "Event at 14:00"), *Counts only* (numbers and rings, no text from calendar or tasks).
- **CORE-5 (P0)** **Layout choice:** the owner can enable the combined "Today" card, individual widgets, or both, and choose which widgets appear.
- **CORE-6 (P1)** Light and dark appearance following the system, using one shared design token set (colors, radii, spacing, type scale).
- **CORE-7 (P1)** Per-integration connect and disconnect, with local deletion of cached data on disconnect.
- **CORE-8 (P1)** Data export to JSON and CSV for all habit and stat history.
- **CORE-9 (P2)** Localisation scaffolding (English first; date, time and units per system locale).

### 5.2 Battery+

- **BAT-1 (P0)** Show charge percentage, charging state and estimated time remaining or time to full.
- **BAT-2 (P0)** Show battery health as full-charge capacity relative to design capacity, using Windows battery data (for example the WMI battery classes in the root\WMI namespace, or the battery report).
- **BAT-3 (P1)** Show charge cycle count where the hardware exposes it; otherwise display "not reported by this device".
- **BAT-4 (P0)** Charge history graph with 24-hour and 7-day views, sampled by the collector at a configurable interval.
- **BAT-5 (P1)** Statistics: average discharge rate, longest unplugged stretch, typical charge limit reached, trend of health over months.
- **BAT-6 (P2)** Optional alert when charge exceeds or drops below owner-defined thresholds.

**Acceptance:** BAT-1 and BAT-4 update within one minute of a state change; health figure matches the system battery report within rounding.

### 5.3 System health

- **SYS-1 (P1)** CPU, RAM and disk usage with a small sparkline for each.
- **SYS-2 (P1)** Network throughput (up and down).
- **SYS-3 (P2)** Temperature where available through supported sensors; hide the tile if unavailable.
- **SYS-4 (P2)** Configurable "compact" (3 numbers) and "detailed" (sparklines) layouts.

### 5.4 Habits and consistency

A single habit engine powers water, study and exercise so that their rings, streaks and graphs behave consistently.

**Shared requirements**
- **HAB-1 (P0)** Each habit has a daily goal, a unit, a progress value and a day status (*complete*, *partial*, *none*, *excused*).
- **HAB-2 (P0)** Apple Fitness-style progress rings per habit, rendered as images in the widget.
- **HAB-3 (P0)** **GitHub-style contribution graph:** a weekly-column grid covering the past year (about 53 weeks by 7 days), one square per day, with 4 to 5 intensity levels based on percent of goal; tooltip or detail view in the companion app shows exact values. A habit switcher selects which habit the graph shows, and an "all habits" aggregate is available.
- **HAB-4 (P0)** Current streak, longest streak and completion rate for each habit.
- **HAB-5 (P1)** *Excused* days (for example a cancelled session) appear in the graph with a distinct, muted marker and do not break the streak up to a monthly allowance (default: 3 excused days, configurable per habit); beyond that, an excused day counts as a miss.

#### 5.4.1 Water
- **WAT-1 (P0)** Fixed base daily target set by the owner, with a starting value suggested by the age preset (WAT-6); always editable.
- **WAT-2 (P0)** One-tap logging of a configurable portion (for example +250 ml) from the widget where supported, from a notification action, or from the tray.
- **WAT-3 (P0)** **Exercise-adjusted target:** when exercise is logged, the day's target increases automatically based on duration and intensity. Proposed default formula: added volume = minutes × rate for intensity (light, moderate, vigorous), with rates configurable in settings (proposed defaults in 5.4.3). The widget shows both the base and the adjusted target (for example "2.5 L + 0.4 L"). These are proposed defaults, not medical advice.
- **WAT-4 (P0)** **Reminders:** Windows notifications at a configurable interval within owner-defined active hours, with action buttons (+portion, snooze). Reminders are skipped when the owner is ahead of pace, and can be paused (for example during a study session).
- **WAT-5 (P1)** Undo of the last log entry; manual edit of the day's total.
- **WAT-6 (P0)** **Age preset:** the owner selects an age or enters a date of birth (optional, stored locally; only the resulting age band is used, and the age updates itself on birthdays). Glance proposes a base target from the reference table below for a reference group the owner picks (female, male, or the average of both). The owner can accept, adjust or ignore it.
- **WAT-7 (P1)** Presets are general reference values, not medical advice, and the app says so. They do not cover pregnancy, breastfeeding, medical conditions or very hot climates; in those cases the owner sets the target with a professional.

Reference values for the age preset are based on the US National Academies adequate intakes for water. The figures below are approximate and must be verified against the source (and current EFSA guidance) in M2. Glance uses the drinks-only column as the default target, because the owner logs drinks, not food. There is no preset below age 9; the target is entered manually.

| Age | Reference group | Total water incl. food (L/day) | Drinks only: default target (L/day) |
| --- | --- | --- | --- |
| 9-13 | Female | 2.1 | 1.6 |
| 9-13 | Male | 2.4 | 1.8 |
| 14-18 | Female | 2.3 | 1.8 |
| 14-18 | Male | 3.3 | 2.6 |
| 19 and over | Female | 2.7 | 2.2 |
| 19 and over | Male | 3.7 | 3.0 |

#### 5.4.2 Study (integration with Study with Sarang)
- **STU-1 (P0)** Daily goal of 120 minutes of **distraction-free** study; ring shows progress toward it.
- **STU-2 (P0)** *Study with Sarang* (the owner's Electron, React and TypeScript Windows app, local-first with no account) is the source of truth for distraction-free time. It already provides a goal-first timer, a browser helper that reports the open website for drift detection, wrap-up ratings, and a year heatmap with streaks. Glance reads its sessions through the bridge in STU-7 and does not duplicate drift detection.
- **STU-3 (P0)** If the integration is unavailable, the widget shows the last known data and a "not connected" state, never a guessed value.
- **STU-4 (P1)** Widget shows the current session state (idle, active, paused due to distraction) when a session is running.
- **STU-5 (P1)** Study stats: focused minutes per day, best day, weekly total, distraction count trends, used by the weekly recap.
- **STU-6 (P2)** Start or stop a session from the widget, if the integration supports remote control.
- **STU-7 (P0)** **Glance bridge:** an opt-in setting in Study with Sarang that publishes each session (start, end, goal, focused minutes, drift events, subject, focus rating) for Glance. Preferred: an append-only JSON Lines file in a shared local folder, which works whichever app is closed. Deferred until live session state is wanted (STU-4): a localhost-only endpoint protected by a per-install token. Reading the Electron app's internal storage is rejected as fragile. The desktop source was not inspected for this draft, so its current storage format is unconfirmed.
- **STU-8 (P2)** Study with Sarang's break prompts include a water idea; a break prompt can log a portion (+250 ml) in Glance through the bridge.

#### 5.4.3 Exercise and recurring sports sessions
- **EXE-1 (P0)** Log an exercise entry with duration and intensity. Intensity is one of three qualitative levels, each with a plain description and sport examples (table below). The entry feeds the water target adjustment (WAT-3).
- **EXE-2 (P0)** **Recurring planned sessions:** the owner defines weekly sports sessions (activity, weekday, start time, planned duration, planned intensity).
- **EXE-3 (P0)** Each occurrence has a status: *planned*, *done*, *cancelled* (excused), or *missed*. Marking an occurrence is one tap from the widget (where supported), a notification action after the session time, or the companion app.
- **EXE-4 (P0)** Marking an occurrence *done* creates the exercise entry automatically using the planned duration and intensity, with the option to adjust.
- **EXE-5 (P0)** Cancelled sessions are shown distinctly in the contribution graph and do not break the streak up to the monthly excused-day allowance (default 3, see HAB-5). Missed sessions always do.
- **EXE-6 (P1)** Edit a single occurrence (move, shorten, skip) without changing the recurring rule.
- **EXE-7 (P1)** A gentle post-session prompt ("Did you train today?") with Done and Cancelled actions; auto-marked *missed* only after owner-configurable grace time.
- **EXE-8 (P1)** Activity library: saved activities with a default intensity and duration, pre-filled with the examples below; the owner can add custom activities.

Intensity levels, with proposed water adjustments (defaults, configurable, not medical advice):

| Level | How it feels | Examples | Water added (ml per minute) |
| --- | --- | --- | --- |
| Light | Easy; you can chat or sing, breathing barely changes | Walking, easy cycling, stretching, yoga, casual badminton, gentle swimming | 5 |
| Moderate | Warm and steady; you can talk in full sentences but not sing | Brisk walking, steady cycling, doubles tennis, dancing, swimming laps, hiking, casual football or basketball | 8 |
| Vigorous | Hard; only a few words at a time, heavy breathing, sweating | Running, a competitive football or basketball match, singles tennis, interval training, fast swimming, climbing, martial arts sparring | 12 |

### 5.5 GitHub streak
- **GH-1 (P1)** Show contribution streak, commits today and total contributions this week using the owner's GitHub account (read-only token or OAuth device flow).
- **GH-2 (P2)** Open PRs and unread notification counts, with a privacy-mode-aware display.
- **GH-3 (P1)** The GitHub streak is available as a source for the "all habits" aggregate graph, using the same visual style.

### 5.6 Calendar (Google Calendar, read-only)
- **CAL-1 (P0)** Connect one or more Google accounts via OAuth, with the read-only calendar scope.
- **CAL-2 (P0)** Widget shows the next one or two events with a countdown, honoring privacy modes.
- **CAL-3 (P0)** **Full-year browsing** in the companion app: month and year views, navigation across the whole year, event detail, and selectable calendars. (Widgets cannot present a year grid, so this view lives in the app, and a widget button opens it.)
- **CAL-4 (P1)** Highlight today, all-day events and conflicts; show recurring planned sports sessions on the same timeline.
- **CAL-5 (P1)** Offline cache of the last successful sync, with a visible "last updated" time.
- **CAL-6 (P0)** For the open-source release, each user supplies their own Google OAuth client ID (no shared credentials ship in the repository).

### 5.7 Tasks
- **TSK-1 (P0)** Source: a built-in task list stored in Glance's local database, so tasks work offline with no account. This is the most reliable option; Google Tasks is out of scope.
- **TSK-2 (P0)** Add, edit and reorder tasks in the companion app, with quick-add; open tasks are ordered by due date, then manual order, and the first one feeds the Today card.
- **TSK-3 (P0)** Complete a task from the widget (where supported) or the companion app.
- **TSK-4 (P1)** Privacy modes: *Redacted* shows "3 tasks left"; *Counts only* shows the number alone.
- **TSK-5 (P1)** Import tasks from a pasted block of text or a markdown file (for example copied from the Wispr Flow scratchpad).
- **TSK-6 (P1)** Task-provider interface so Todoist or Microsoft To Do can be added later without changing the widgets.
- **TSK-7 (P2)** Optional read-only importer for Wispr Flow scratchpad notes (MCP with OAuth).

### 5.8 Today card (combined widget)
- **TDY-1 (P1)** One card combining the next event, the top task, and habit rings for water, study and exercise, with the current streak.
- **TDY-2 (P1)** Card sections can be toggled and reordered in settings.
- **TDY-3 (P1)** Respects the global and per-widget privacy mode.

### 5.9 Focus timer
- **FOC-1 (P1)** Start, pause and stop a focus or pomodoro timer with a progress ring; durations are configurable.
- **FOC-2 (P1)** Completed sessions contribute to the study habit when linked to a Study with Sarang session, otherwise they are logged as unverified focus time and shown separately.
- **FOC-3 (P2)** Optional pause of water reminders while a focus session is active.

### 5.10 Weekly recap
- **REC-1 (P1)** A weekly summary (Sunday evening by default) with focused study minutes, water goal completion rate, sessions done, cancelled and missed, battery statistics, tasks completed, and streak changes.
- **REC-2 (P1)** Viewable in the companion app, with a compact version in a widget.
- **REC-3 (P2)** Week-over-week comparison with simple trend indicators.

## 6. Design requirements

- Apple-inspired visual language: soft rounded corners, plenty of whitespace, a muted background with one accent color per habit (for example blue for water, green for exercise, orange for study), thin weights for big numbers, and a clear type scale.
- Rings and sparklines are rendered at high resolution for both normal and high-DPI displays, with light and dark variants.
- Contribution graph uses a single hue per habit with 4 to 5 steps, plus one distinct muted style for excused (cancelled) days. Colors must remain distinguishable for common color-vision differences, so intensity must not rely on hue alone.
- Widget sizes: support the small, medium and large sizes the Widgets platform offers; each widget defines a priority order for what to drop at small sizes.
- Motion: minimal; no animations on the lock screen.
- Fonts: use system or openly licensed fonts only (Apple's proprietary fonts cannot be bundled).

## 7. Non-functional requirements

- **Privacy:** all personal data stored locally; no telemetry; OAuth tokens stored in Windows Credential Manager or DPAPI-protected storage; privacy modes apply to widgets, notifications and any lock-screen-visible text.
- **Performance:** background collector uses negligible CPU and battery (target under 1 percent average CPU); widget refresh within one second of Windows requesting an update.
- **Reliability:** widgets show the last known good data with a timestamp if an integration fails; no crash loops in the provider.
- **Security:** least-privilege scopes (Google calendar read-only; GitHub read-only token); no secrets in the repository; signed releases with documented verification.
- **Maintainability:** modular projects (core, collector, provider, app, integrations), unit tests for habit logic (targets, streaks, excused days), and a documented SQLite schema.
- **Open source:** permissive license (for example MIT), contributing guide, build instructions, and a README with screenshots.

## 8. Open questions and assumptions

1. **Lock screen interactivity:** can widget buttons be used while locked? If not, fallbacks are notification actions (with buttons), the tray flyout, or deep links that require unlock.
2. **Study with Sarang bridge:** v1 uses the JSON Lines file only. Confirm where the app stores sessions today and which fields to publish. The repository was reviewed at README level only.
3. **Task sources beyond the built-in list:** decide later whether to add Todoist or a Wispr Flow importer.
4. **Battery data:** which fields (design capacity, full-charge capacity, cycles) does this laptop's firmware expose?
5. **Water presets:** verify the reference values against the source before release, and choose the default reference group (female, male, or average).
6. **Distribution polish:** self-signed certificate guidance for other users, and winget manifest ownership.

## 9. Milestones

| Milestone | Scope | Exit criteria |
|---|---|---|
| **M0 – Spike** | Minimal packaged widget, one button, sideloaded and pinned to the lock screen | Lock screen behavior of buttons documented; Study with Sarang bridge format confirmed |
| **M1 – Battery+** | Collector, SQLite, Battery+ widget, companion app shell, privacy modes | BAT-1, BAT-2, BAT-4, CORE-1 to CORE-5 met |
| **M2 – Habits** | Habit engine, water with age presets, exercise adjustment and reminders, exercise sessions, contribution graph | WAT-1 to WAT-4, EXE-1 to EXE-5, HAB-1 to HAB-4 met |
| **M3 – Study and focus** | Study with Sarang integration, study ring, focus timer | STU-1 to STU-3, FOC-1 met |
| **M4 – Calendar and tasks** | Google Calendar, year browser, built-in task list | CAL-1 to CAL-3, TSK-1 to TSK-3 met |
| **M5 – Combined and stats** | Today card, system health, GitHub streak, weekly recap | TDY-1, SYS-1, GH-1, REC-1 met |
| **M6 – Release** | Signing, winget and GitHub release, docs, screenshots | Public v1.0 on GitHub |

## 10. Risks

| ID | Risk | Mitigation |
|---|---|---|
| R1 | Widgets not interactive while locked | Spike in M0; notification actions and tray as fallbacks |
| R2 | Sparse or changing third-party widget support on the lock screen | Keep the widget layer thin; the companion app carries rich features |
| R3 | Google OAuth friction for an open-source app (verification, token expiry in testing mode) | Bring-your-own client ID; document publishing status for personal use |
| R4 | External task services can change or fail | Built-in local task list is the default; provider interface for Todoist later |
| R5 | Battery fields not exposed by all laptops | Graceful "not reported" states |
| R6 | Study with Sarang has no documented local interface | Build the opt-in bridge (STU-7) before M3; show a not-connected state |
| R7 | Lock screen widget behavior changes across Windows 11 builds | Pin supported builds in the README; test on each feature update |

## 11. Success metrics

Personal-use success for the first three months:
- Lock screen shows the owner's widgets reliably after every lock, wake and reboot.
- Water goal reached on a rising share of days compared with the first month.
- 2 hours of distraction-free study logged on a rising share of days.
- Planned sports sessions marked (done, cancelled, or missed) within a day, so the graph stays truthful.
- Open-source adoption signals: stars, successful installs from release builds, and external issues or pull requests.
